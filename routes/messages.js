const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

require("dotenv").config();

const Message = require("../models/Message");

const Conversation = require("../models/Conversation");

//Get Messages
router.get("/:conversation_id", auth, async (req, res) => {
  const { conversation_id } = req.params;
  const messages = await Message.find({ conversation_id });
  res.json({ messages });
});

//Create Message
router.post("/message", auth, async (req, res) => {
  const { sender_id, sender_name, receiver_id, receiver_name, text } = req.body;
  let conversation_id = null;
  //Check if convo does not exists, create convo and use id to create message.
  //else grab convo id to create message
  const conversation = await Conversation.findOne({
    participant_ids: { $all: [sender_id, receiver_id] },
  });
  if (conversation) {
    conversation_id = conversation.id;
  } else {
    const newConversation = new Conversation({
      participant_ids: [sender_id, receiver_id],
    });
    savedConversation = await newConversation.save();
    conversation_id = savedConversation.id;
  }
  const newMessage = new Message({
    conversation_id,
    sender_id,
    sender_name,
    receiver_id,
    receiver_name,
    text,
  });
  try {
    const msg = await newMessage.save();
    if (!msg) throw Error("Something went wrong saving the item");
    res.status(200).json({ msg });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//Delete Message
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) throw Error("No item found");

    const removed = await message.remove();
    if (!removed)
      throw Error("Something went wrong while trying to delete the item");

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
