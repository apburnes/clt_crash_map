// Require modules to get GeoRSS
var request = require('request');
var parseString = require('xml2js').parseString;
var url = "http://maps.cmpd.org/datafeeds/accidentsgeorss.ashx"

// Declare mongoose and feature model
var mongoose = require('mongoose');
var Feature = require('./Feature');

// Start and connect to database
mongoose.connect(process.env.MONGODB_GEORSS || 'mongodb://localhost:27017/georss_test');
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.')
});

// Get and convert GeoRss XML to an array of objects
function getGeoRss(url, done) {
  request(url, function(err, res, body) {
    if (err) return log(err);
    parseString(body, function(err, result) {
      if (err) return log(err);
      var events = result.rss.channel[0].item || [];
      done(null, events);
    });
  });
}

// Iterate and save events to the Feature Document in the database
function iterGeoData(events, done) {

  events.forEach(function(item, ix, arr) {
    var len = arr.length - 1;
    if (len === 0) {
      done();
    }
    else if (ix < len) {
      saveGeoData(item, function() {
        log('Saved')
      });
    }
    else if (ix === len) {
      saveGeoData(item, function() {
        done();
      });
    }
    else {
      log('Lost Feature');
      console.log("Last: " + JSON.stringify(feature, null, 2));
    }
  });
}

function saveGeoData(item, done) {
  var coords = item['georss:point'][0].split(' ');

  var feature = new Feature({
    type: 'Feature',
    properties: [{
      title: item.title[0],
      eventNum: item.event_no[0],
      dateAdded: item.datetime_add[0],
      division: item.division[0],
      address: item.address[0],
      eventType: item.event_type[0],
      eventDesc: item.event_desc[0]
    }],
    geometry: [{
      type: 'Point',
      coordinates: [
        coords[1],
        coords[0]
      ]
    }]
  });

  feature.save(function(err) {
    if (err) return done(err);
    done();
  });
}

// Find Features
function findData(done) {
  Feature.find(function(err, features) {
    var count = features.length;
    done(count);
  });
};

// Log messages
function log(msg) {
  console.log(msg);
}

// Get and save the converted data

setInterval(function() {
  getGeoRss(url, function(err, events) {
    if (err) return log(err);
    iterGeoData(events, function() {
      findData(function(count) {
        log('Total incidents recorded: ' + count);
      })
    });
  })
}, 600000);
