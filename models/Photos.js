const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
  },
  geolocation: {
    type: String,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iso: {
    type: String,
    required: true
  },
  aperture: {
    type: String,
    required: true
  },
  focalLength: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  publishDate: {
    type: String,
    required: true
  }
});

module.exports = Photo = mongoose.model('photos', PhotoSchema);