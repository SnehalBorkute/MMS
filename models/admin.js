
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensures email is unique in the database
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("admin", adminSchema);