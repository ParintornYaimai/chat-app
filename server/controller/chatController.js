const Chat = require("../models/chatModel");

//createChat
//findUserChat
//findUser

exports.createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    if (!firstId || !secondId) {
      return res
        .status(400)
        .json({
          message:
            "The user ID was not found and the chat could not be created.",
        });
    }
    const chat = await Chat.findOne({ members: { $all: [firstId, secondId] } });
    if (chat) {
      return res.status(200).json(chat);
    } else {
      const newChat = await Chat.create({
        members: [firstId, secondId]
      });
      res.status(200).json(newChat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.find({ members: { $in: [userId] } });
    if (chats ) {
      res.status(200).json(chats);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    if (!firstId || !secondId) {
      return res.status(400).json({ message: "User id not found" });
    }
    const chats = await Chat.find({
      members: { $all: [firstId, secondId] },
    });
    if (chats) {
      return res.status(200).json(chats);
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
