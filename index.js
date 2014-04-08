var request = require('request');

var options = {
  url: 'http://cmpd-feed-etl.herokuapp.com/',
}

var data = request(options, function(err, res, body) {
  if(err) return console.log(err);
  console.log(res.toJSON);
});

data
