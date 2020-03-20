const express = require("express");
const router = express.Router();
const { AuthenticationSeller, AuthorizationSeller } = require("../middlewares");
const { SellerController } = require("../controllers");


router.post("/login", SellerController.login);
router.post("/register", SellerController.register);

router.use(AuthenticationSeller);
//router.use(AuthorizationSeller);
router.get("/dashboard", SellerController.dashboard);

router.patch("/createLink", SellerController.createLink);
router.patch("/:id/destroyLink", SellerController.destroyLink);

router.patch("/createChatBot", SellerController.createChatBot);
router.patch("/updateChatBot/:id", SellerController.updateChatBot);
router.patch("/destroyChatBot/:id", SellerController.destroyChatBot);

router.patch("/createCollection", SellerController.createCollection);
router.patch("/updateCollection/:id", SellerController.updateCollection);
router.patch("/destroyCollection/:id", SellerController.destroyCollection);

module.exports = router;
