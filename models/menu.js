const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  date: Date,
  day: String,
  type: String, // Lunch or Dinner
  items: [String]
});

module.exports = mongoose.model("Menu", menuSchema);
