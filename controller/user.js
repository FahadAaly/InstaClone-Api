const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {

    GetUser: async (req, res) => {
        const user = await User.findOne(req.params.id);
        user.password = undefined;
        const post = await Post.find({postedBy: req.params.id}).populate("postedBy", "_id name");
        try {
            res.send({ message: "", status: "SUCCESS", data: {user,post} });
        } catch (error) {
            res.send(error);
        }
    }
}
