const Conversation = require("../models/conversation");
// const cloudinary = require("../utils/cloudinary");

exports.createMessage = (req, res) => {
  const message = new Conversation({
    send: req.body.send,
    received: req.body.received,
    message: req.body.message,
    imageUrl: req.body.imageUrl
  });
  message
    .save()
    .then(() => {
      res.status(201).json({
        message
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getConversation = async (request, response) => {
  const messages = await Conversation.find({
    $and: [
      { $or: [{ send: request.params.pseudo }, { received: request.params.pseudo }]},
      { $or: [{ send: request.params.user }, { received: request.params.user }] }
    ],
  });
  return response.status(200).send({
    type: "Success",
    messages: messages,
  });
};
