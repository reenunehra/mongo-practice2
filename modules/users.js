const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  DateModified: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("users", usersSchema);
