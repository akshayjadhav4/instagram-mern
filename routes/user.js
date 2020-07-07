const express = require("express");
const router = express.Router();

const { getUserById, getUser, getAllUsers ,updateUser,userPosts} = require("../controllers/user");
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
  getAllUsers
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
  

module.exports = router;
