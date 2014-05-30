var mongoose = require('mongoose');

var propSchema = new mongoose.Schema({
  title: {
    type: String
  },
  eventNum: {
    type: String,
    unique: true
  },
  dateAdded: { type: Date },
  division:  { type: String },
  address:   { type: String },
  eventType: { type: String },
  eventDesc: { type: String }
});

var geoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [],
    default: [0,0]
  }
});

var featureSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Feature'
  },
  properties: [propSchema],
  geometry: [geoSchema]
});

module.exports = mongoose.model('Feature', featureSchema);
// module.exports = mongoose.model('Geometry', geoSchema);
// module.exports = mongoose.model('Properties', propSchema);
