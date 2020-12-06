const Post = require("../models/post");

module.exports = {
    GetAllPost: async (req, res) => {
        const userId = req.user._id.toString();
        try {
            const posts = await Post.find()
                .populate("postedBy", "_id name")
                .populate("comments.postedBy", "_id name");
            posts.map(
                (post) => (post.likeByUser = post.likes.includes(userId))
            );
            res.send({ message: "", data: posts, status: "SUCCESS" });
        } catch (error) {
            res.send(error);
        }
    },

    CreatePost: async (req, res) => {
        const { title, description, image } = req.body;

        if (!title || !description || !image) {
            return res.status(422).json({ error: "Please add all the fields" });
        }
        req.user.password = undefined; // not to store password
        const post = new Post({
            title,
            description,
            postedBy: req.user,
            image,
        });

        try {
            await post.save();
            res.send({
                message: "Post created successfully",
                data: post,
                status: "SUCCESS",
            });
        } catch (error) {
            res.send(error);
        }
    },

    MyPost: async (req, res) => {
        try {
            const posts = await Post.find({ postedBy: req.user._id }).populate(
                "postedBy",
                "_id name"
            );
            res.send({ message: "", status: "SUCCESS", data: posts });
        } catch (error) {
            res.send(error);
        }
    },

    LikePost: async (req, res) => {
        const post = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $inc: { likesCount: 1 },
                $push: { likes: req.user._id },
                $set: { likeByUser: true },
            },
            { new: true }
        );
        try {
            res.send({
                message: "Successfully like the post",
                status: "SUCCESS",
                data: post,
            });
        } catch (error) {
            res.send(error);
        }
    },

    UnlikePost: async (req, res) => {
        const post = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $inc: { likesCount: -1 },
                $pull: { likes: req.user._id },
            },
            { new: true }
        );
        try {
            res.send({
                message: "Successfully unlike the post",
                status: "SUCCESS",
                data: post,
            });
        } catch (error) {
            res.send(error);
        }
    },

    Comment: async (req, res) => {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id,
        };
        const postComment = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment },
            },
            {
                new: true,
            }
        )
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name");
        try {
            res.send({
                message: "Successfully comment",
                status: "SUCCESS",
                data: postComment,
            });
        } catch (error) {
            res.send(error);
        }
    },

    DeleteComment: async (req, res) => {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $pull: { comments: { _id: req.params.commentId } },
            },
            {
                new: true,
            }
        )
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name");

        if (!post) {
            return res.status(422).json({ message: "Post not found" });
        }
        try {
            res.send({
                message: "Comment deleted successfully",
                status: "SUCCESS",
                data: post,
            });
        } catch (error) {
            res.send(error);
        }
    },

    DeletePost: async (req, res) => {
        const post = await Post.findOne({ _id: req.params.postId }).populate(
            "postedBy",
            "_id"
        );
        if (!post) {
            return res.status(422).json({ message: "Post not found" });
        } else if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.remove();
        }
        try {
            res.send({ message: "Successfully deleted", data: post });
        } catch (error) {
            res.send(error);
        }
    },
};
