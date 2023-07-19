const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PhotographerSchema = new mongoose.Schema({
  User: {
    type: ObjectId,
    ref: 'users',
    required: true
  },
  Age: {
    type: String,
    required: true
  },
  TimeOfExperience: {
    type: String,
    required: true
  },
  Camera: {
    type: String,
    required: true
  },
  Lens: {
    type: String,
    required: true

  },
  ProfileImg: {
    type: String,
    required: true
  }
});

module.exports = Photographer = mongoose.model('photographers', PhotographerSchema);