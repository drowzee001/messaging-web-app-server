const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participant_ids: {
    type: Array,
    required: true,
  },
});

module.exports = Conversation = mongoose.model(
  "conversation",
  ConversationSchema
);
