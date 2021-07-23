const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation_id: {
    type: String,
    required: true,
  },
  sender_id: {
    type: String,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },  
  receiver_id: {
    type: String,
    required: true
  },
  receiver_name: {
    type: String,
    required: true
  },  
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Message = mongoose.model("message", MessageSchema);
