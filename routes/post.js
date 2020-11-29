const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

const PostController = require("../controller/post");

router.get('/allpost', auth, PostController.GetAllPost);
router.post('/createpost', auth, PostController.CreatePost);
router.get('/mypost', auth, PostController.MyPost);
router.put('/like', auth, PostController.LikePost);
router.put('/unlike', auth, PostController.UnlikePost);
router.put('/comment', auth, PostController.Comment);
router.delete('/deletepost/:postId', auth, PostController.DeletePost);

module.exports = router;
