const express = require("express");
const router = express.Router();
const { Connect } = require("../middlewares");
const SellerRouter = require("./seller");
const CustomerRouter = require("./customer");
const ChatRouter = require("./chat");

router.use(Connect);
router.use("/sellers", SellerRouter);
router.use("/customers", CustomerRouter);
router.use("/chats", ChatRouter);

module.exports = router;

