const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:pseudo", userController.getAllUsers);

module.exports = router;