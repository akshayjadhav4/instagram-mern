const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authentication");

const { getUserById} = require("../controllers/user");
const { getPostById} = require("../controllers/post");
const { addComment } = require("../controllers/comment");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post("/post/comment/:postId/:userId", isSignedIn, addComment);





module.exports = router;