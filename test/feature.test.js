var chai = require('chai');
var should = chai.should();
var mongoose = require('mongoose');
var Feature = require('../Feature');

mongoose.connect(process.env.MONGODB_GEORSS || 'mongodb://localhost:27017/georss_test');
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.')
});

var feature = new Feature({
  "type": "Feature",
  "properties": [{
    "title": "TRAFFIC CONTROL/MALFUNCTION at 707  PAVILION BV ",
    "eventNum": "O0529164400",
    "dateAdded": "5/29/2014 4:44:16 PM",
    "division": "UNIVERSITY CITY",
    "address": "707  PAVILION BV ",
    "eventType": "TF-CNTRL",
    "eventDesc": "TRAFFIC CONTROL/MALFUNCTION"
  }],
  "geometry": [{
    "type": "Point",
    "coordinates": [
      "-80.710670",
      "35.327362"
    ]
  }]
});

var feature2 = new Feature({
  "type": "Feature",
  "properties": [{
    "title": "TRAFFIC CONTROL/MALFUNCTION at 707  PAVILION BV ",
    "eventNum": "O0529164403",
    "dateAdded": "5/29/2014 4:44:16 PM",
    "division": "UNIVERSITY CITY",
    "address": "707  PAVILION BV ",
    "eventType": "TF-CNTRL",
    "eventDesc": "TRAFFIC CONTROL/MALFUNCTION"
  }],
  "geometry": [{
    "type": "Point",
    "coordinates": [
      "-80.710670",
      "35.327362"
    ]
  }]
});

describe('Feature Model', function() {
  it('Should create a new feature', function(done) {
    feature.save(function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('Should not save duplicate features', function(done) {
    feature.save(function(err) {
      if (err) return done(err);
      done();
    })
  });

  it('Should create a new different feature', function(done) {
    feature2.save(function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('Should find only 2 records', function(done) {
    Feature.find({"properties.eventNum": { $in: ['O0529164400','O0529164403'] }}, function(err, feat) {
      if (err) return done(err);
      feat.length.should.equal(2);
      done();
    })
  });

  it('Should find and remove all features by sub doc', function(done) {
    Feature.find({"properties.eventNum": { $in: ['O0529164400','O0529164403'] }}, function(err, feat) {
      if (err) return done(err);
      feat.forEach(function(model) {
        model.remove({ _id: model._id}, function(err) {
          if (err) return done(err);
          done();
        });
      });
      done();
    })
  });

  it('Should have no records after remove', function(done) {
    Feature.find({"properties.eventNum": { $in: ['O0529164400','O0529164403'] }}, function(err, feat) {
      if (err) return done(err);
      feat.length.should.equal(0);
      done();
    });
  });
});
