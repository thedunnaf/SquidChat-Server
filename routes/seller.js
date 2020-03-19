const express = require("express");
const router = express.Router();
const {AuthorizationSeller} = require("../middlewares");
const {SellerController} = require("../controllers");

router.get("/", SellerController.findAll);
router.post("/", SellerController.create);
//router.use(":/id", AuthorizationSeller);
router.get("/:id", SellerController.findOne);
router.put("/:id", SellerController.update);
router.delete("/:id", SellerController.destroy);

module.exports = router;
