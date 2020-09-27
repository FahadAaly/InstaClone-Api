const express = require("express");
const router = new express.Router();
const UserController = require("../controller/user");
const auth = require("../middleware/auth");

router.post('/signup', UserController.SignUp);
router.post('/signin', UserController.SignIn);
router.get('/user', auth, UserController.GetUser);

module.exports = router;
