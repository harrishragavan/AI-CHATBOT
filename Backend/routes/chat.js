const Chat = require("../models/Chat");

app.post("/api/chat", async (req, res) => {
  const { message, userId } = req.body;

  // Send user message to LLM
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistral/mistral-7b-instruct",
      messages: [{ role: "user", content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const botReply = response.data.choices[0].message.content;

  // Save to MongoDB
  let chat = await Chat.findOne({ userId });

  if (!chat) {
    chat = new Chat({ userId, messages: [] });
  }

  chat.messages.push(
    { sender: "user", text: message },
    { sender: "bot", text: botReply }
  );

  await chat.save();

  res.json({ reply: botReply });
});
