const mongoose = require("mongoose");
const {v4 : uuidv4} = require('uuid');

const usersTodoSchema = new mongoose.Schema({
  
  userId: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  task: [
    {
      id: {
        type: String,
        required: true,
        default:uuidv4()
      },
      description: {
        type: String,
        required: false,
      },
      status: {
        type: Boolean,
        required: true,
      },
      taskcreatedDate: {
        type: Date,
        required: false,
        default:Date.now()
      },
    },
  ],

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  DateModified: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  
});

module.exports = mongoose.model("usersTodo", usersTodoSchema);
