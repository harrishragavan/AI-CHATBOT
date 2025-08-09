const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ["user", "bot"], required: true },
  type: { type: String, enum: ["text", "image", "voice"], default: "text" },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
