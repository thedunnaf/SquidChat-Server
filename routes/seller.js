const express = require("express");
const router = express.Router();
const { AuthenticationSeller } = require("../middlewares");
const { SellerController } = require("../controllers");

router.post("/login", SellerController.login);
router.post("/register", SellerController.register);

router.use(AuthenticationSeller);
router.get("/dashboard", SellerController.dashboard);
router.put("/updateAccount", SellerController.updateAccount);

// router.patch("/destroyLink/:id", SellerController.destroyLink);

router.patch("/createChatBot", SellerController.createChatBot);
router.patch("/updateChatBot/:id", SellerController.updateChatBot);
router.patch("/destroyChatBot/:id", SellerController.destroyChatBot);

router.patch("/createCollection", SellerController.createCollection);
router.patch("/updateCollection/:id", SellerController.updateCollection);
router.patch("/destroyCollection/:id", SellerController.destroyCollection);

router.patch("/createField/:id_collection", SellerController.createField);
router.patch("/updateField/:id_collection/:id_field", SellerController.updateField);
router.patch("/destroyField/:id_collection/:id_field", SellerController.destroyField);

module.exports = router;
