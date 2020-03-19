const express = require("express");
const router = express.Router();
const { ChatController } = require("../controllers");

router.get("/:link", ChatController.findAllChatByLink);

module.exports = router;

