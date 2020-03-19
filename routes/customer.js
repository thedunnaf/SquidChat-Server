const express = require("express");
const router = express.Router();
const {AuthorizationCustomer} = express.Router("../middlewares");
const {CustomerController} = require("../controllers");

router.get("/", CustomerController.findAll);
router.post("/", CustomerController.create);
//router.use("/:id", AuthorizationCustomer);
router.get("/:id", CustomerController.findOne);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.destroy);

module.exports = router;
