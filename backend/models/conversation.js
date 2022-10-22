const mongoose = require("mongoose");
const database = require("../utils/mongoose");

const conversationSchema = new mongoose.Schema(
  {
    send: String,
    received: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);