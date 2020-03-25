const express = require("express");
const router = express.Router();
const { AuthenticationChat } = require("../middlewares");
const { ChatController } = require("../controllers");

// router.use(AuthenticationChat);
// router.post("/", ChatController.findAll);
// router.post("/sendChat", ChatController.chat);

module.exports = router;