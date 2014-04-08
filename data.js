var request = require('request');

var options = {
  url: 'http://cmpd-feed-etl.herokuapp.com/',
}

exports.index = function(req, res) {
  request(options, function(err, response, body) {
  if(err) return console.log(err);
  var json = JSON.parse(body, null, 2);

  res.render('index', {
    title: "Charlotte Crash Map",
    events: json.events
  });

});
}
