const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");

module.exports = {

    SignUp: async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({ error: "Please add all the fields" });
        }

        const savedUser = await User.findOne({ email: email });
        if (savedUser) {
            return res.status(422).json({ error: "User already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 8);

        const user = new User({ name, email, password: hashedPassword });

        try {
            await user.save();
            res.send({ message: "data saved successfully", data: user });
        } catch (error) {
            res.send(error);
        }
    },
    
    SignIn: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Please provide email and password" });
        }
        const savedUser = await User.findOne({ email });
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" });
        }
        const matchPassword = await bcrypt.compare(password, savedUser.password);
        if (!matchPassword) {
            return res.status(422).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
        savedUser.password = undefined;
        try {
            res.send({ message: "signin successfully", token, user: savedUser });
        } catch (error) {
            res.send(error);
        }
    },

    GetUser: async (req, res) => {
        const user = await User.findById(req.user._id);
        user.password = undefined;
        try {
            res.send({ message: "", status: "SUCCESS", data: user });
        } catch (error) {
            res.send(error);
        }
    }
}


