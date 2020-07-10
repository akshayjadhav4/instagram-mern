const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  getAllUsersForSuggestion,
  updateUser,
  userPosts,
  follow,
  followingList,
  unfollow,
  getAllPostsOfFollowing
} = require("../controllers/user");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authentication");

//router param
router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get(
  "/user/getAllUsers/:userId",
  isSignedIn,
  getAllUsersForSuggestion
);

router.put(
  "/user/updateProfile/:userId",
  isSignedIn,
  isAuthenticated,
  updateUser
);

router.get(
    "/user/posts/:userId",
    isSignedIn,
    isAuthenticated,
    userPosts
  );
  

router.put("/user/follow/:userId",isSignedIn,follow)
router.get("/user/followingList/:userId",isSignedIn,followingList)
router.put("/user/unfollow/:userId",isSignedIn,unfollow)

router.get(
  "/user/getAllPostsOfFollowing/:userId",
  isSignedIn,
  getAllPostsOfFollowing
);

module.exports = router;
