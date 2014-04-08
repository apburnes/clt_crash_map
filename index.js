var request = require('request');

var options = {
  url: 'http://cmpd-feed-etl.herokuapp.com/',
}

var data = request(options, function(err, res, body) {
  if(err) return console.log(err);
  var json = JSON.parse(body, null, 2);
  console.log(json.events.length);
});

data
