const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

require("dotenv").config();

const Conversation = require("../models/Conversation");

//Get Conversations
router.get("/", auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const conversations = await Conversation.find({
      participant_ids: { $all: user_id },
    });
    if (!conversations) throw Error("No Conversations");

    const newConversations = [];
    async function getResults() {
      const promises = conversations.map(async (conversation) => {
        const otherUserId = conversation.participant_ids.find(
          (user_id) => user_id !== req.user.id
        );
        const otherUser = await User.findById(otherUserId).select("id name");
        newConversations.push({
          conversation_id: conversation._id,
          otherUser: otherUser,
        });
      });
      return Promise.all(promises);
    }

    await getResults();
    newConversations.sort(function (a, b) {
      if (a.otherUser.name < b.otherUser.name) {
        return -1;
      }
      if (a.otherUser.name > b.otherUser.name) {
        return 1;
      }
    });

    res.status(200).json(newConversations);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
