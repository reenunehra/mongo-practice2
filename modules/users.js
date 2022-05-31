const mongoose = require("mongoose");



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

// --------------------------------------email validate----------------------------------------

// usersSchema.path('email').validate(async (email) => {
 
//   const emailCount = await mongoose.models.users.countDocuments({ email }) 
//   return !emailCount
// }, 'Email already exists')


// ------------------------------------------------------------------------------------------------


module.exports = mongoose.model("users", usersSchema);
