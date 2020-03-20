const express = require("express");
const router = express.Router();
const { AuthenticationCustomer, AuthorizationCustomer } = require("../middlewares");
const { CustomerController } = require("../controllers");

router.post("/login", CustomerController.login);
router.post("/register", CustomerController.register);

router.use(AuthenticationCustomer);
//router.use(AuthorizationCustomer);

router.get("/dashboard", CustomerController.dashboard);

router.patch("/createLink", CustomerController.createLink);
router.patch("/destroyLink/:id", CustomerController.destroyLink);

module.exports = router;
