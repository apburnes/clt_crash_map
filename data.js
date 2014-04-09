var request = require('request');

var options = {
  url: 'http://cmpd-feed-etl.herokuapp.com/',
}

function toGeoJSON(json, done) {

  var features = json.events;

  function collection() {
    this.type = "FeatureCollection";
    this.features = [];
  }

  var geojson = new collection();

  for (var i = 0; i < features.length; i++) {
    var coords = [features[i].latitude, features[i].longitude];
    var message = features[i].message;

    function geo(point) {
      this.type = "Point";
      this.coordinates = point;
    }

    function aFeature(point, message) {
      this.geometry = new geo(point);
      this.properties = {
        msg: message
      }
    };

    var feature = new aFeature(coords, message);
    geojson.features.push(feature);
  };

  done(null, geojson)
};

exports.index = function(req, res) {
  request(options, function(err, response, body) {
  if(err) return console.log(err);
  var json = JSON.parse(body, null, 2);

  toGeoJSON(json, function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
    }
  });

  res.render('index', {
    title: "Charlotte Crash Map",
    events: json.events
  });

});
}
