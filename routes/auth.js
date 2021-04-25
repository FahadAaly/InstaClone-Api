const express = require("express");
const router = new express.Router();
const AuthController = require("../controller/auth");
const auth = require("../middleware/auth");

router.post('/signup', AuthController.SignUp);
router.post('/signin', AuthController.SignIn);
router.get('/user', auth, AuthController.GetCurrentUser);

module.exports = router;
