const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

router.post("/", conversationController.createMessage);
router.get("/:pseudo/:user", conversationController.getConversation);

module.exports = router;