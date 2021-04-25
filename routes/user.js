const express = require("express");
const router = new express.Router();
const UserController = require("../controller/user");
const auth = require("../middleware/auth");

router.get('/user/:id', auth, UserController.GetUser);

module.exports = router;
