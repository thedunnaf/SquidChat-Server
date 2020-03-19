const express = require("express");
const router = express.Router();
const {Connect, Authentication} = require("../middlewares");
const SellerRouter = require("./seller");
const CustomerRouter = require("./customer");

router.use(Connect);
//router.use("/", Authentication);
router.use("/customers", CustomerRouter);
router.use("/sellers", SellerRouter);

module.exports = router;

