const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authentication");

const { getUserById} = require("../controllers/user");
const {
  getPostById,
  createPost,
  getPost,
  photo,
  deletePost,
  updatePost,
  userPostsForExplore,
  likePost,
  unlikePost
} = require("../controllers/post");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post(
  "/post/create/:userId",
  isSignedIn,
  isAuthenticated,
  createPost
);


router.get("/post/:postId", isSignedIn, getPost);
router.get("/post/photo/:postId", photo);

router.get(
  "/post/delete/:postId/:userId",
  isSignedIn,
  isAuthenticated,
  deletePost
);

router.put(
  "/post/update/:postId/:userId",
  isSignedIn,
  isAuthenticated,
  updatePost
);

router.get(
  "/user/explore/posts/:userId",
  isSignedIn,
  userPostsForExplore
);

router.put("/post/like/:postId/:userId", isSignedIn, likePost);

router.put("/post/unlike/:postId/:userId", isSignedIn, unlikePost);

module.exports = router;
