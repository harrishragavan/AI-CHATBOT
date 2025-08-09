const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error", err));

const chatSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  reply: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// POST /chat
app.post("/api/chat", async (req, res) => {
  const { message, username, userId } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No response";

    await Chat.create({ userId, username, message, reply });

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

// GET /history/:userId
app.get("/api/history/:userId", async (req, res) => {
  const chats = await Chat.find({ userId: req.params.userId }).sort({ timestamp: -1 });
  res.json(chats);
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
