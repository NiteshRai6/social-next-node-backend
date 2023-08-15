const router = require('express').Router();
const { addPost, deletePost, getPosts, updatePost } = require('../controllers/post.js');
const upload = require('../utils/upload.js');

router.get("/", getPosts);
router.post("/", upload.single("post_img"), addPost);
router.delete("/:post_id", deletePost);
router.put("/:post_id", upload.single("post_img"), updatePost);

module.exports = router;