const User = require("../models/user");
const Post = require("../models/post");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: `No user found  ${error}`,
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.getAllUsersForSuggestion = (req, res) => {
  // geting all user except specified id $ne

  User.find(
    {
      $and: [
        { _id: { $ne: req.profile._id } },
        { _id: { $nin: req.profile.following } },
      ],
    },
    { encry_password: 0, salt: 0 }
  ).exec((error, users) => {
    if (error || !users) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    return res.json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },

    (error, user) => {
      if (error) {
        return res.status(400).json({
          error: "Profile edit opration failed.",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPosts = (req, res) => {
  Post.find({ author: req.profile._id })
    .sort({ createdAt: -1 })
    .select("-photo")
    .populate("author", "_id fullname") //pass field name and which fileds want to get
    .populate("comments")
    .exec((error, posts) => {
      if (error) {
        return res.status(400).json({
          error: "No post found",
        });
      }
      return res.json(posts);
    });
};

exports.follow = (req, res, followingId) => {
  // console.log(req.profile.fullname);
  // console.log(req.body.followingId);
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { following: req.body.followingId } },
    { new: true },
    (error, followUser) => {
      if (error) {
        return res.status(400).json({
          error: "User following opration failed",
        });
      }
      User.findByIdAndUpdate(
        { _id: req.body.followingId },
        { $push: { followers: req.profile._id } },
        { new: true },
        (error, result) => {
          if (error) {
            return res.status(400).json({
              error: "User follower opration failed",
            });
          }
        }
      );
      res.json(followUser);
    }
  );
};

exports.followingList = (req, res) => {
  User.find({ _id: req.profile._id }, { following: 1 })
    .populate("following", "fullname  username")
    .exec((error, followingUsers) => {
      if (error) {
        return res.status(400).json({
          error: "No users found",
        });
      }
      return res.json(followingUsers);
    });
};

exports.followersList = (req, res) => {
  User.find({ _id: req.profile._id }, { followers: 1 })
    .populate("followers", "fullname  username")
    .exec((error, followersUsers) => {
      if (error) {
        return res.status(400).json({
          error: "No users found",
        });
      }
      return res.json(followersUsers);
    });
};

exports.unfollow = (req, res, unFollowingId) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $pull: { following: req.body.unFollowingId } },
    { new: true },
    (error, unFollowUser) => {
      if (error) {
        return res.status(400).json({
          error: "User unfollowing opration failed",
        });
      }
      User.findByIdAndUpdate(
        { _id: req.body.unFollowingId },
        { $pull: { followers: req.profile._id } },
        { new: true },
        (error, result) => {
          if (error) {
            return res.status(400).json({
              error: "User unfollower opration failed",
            });
          }
        }
      );
      res.json(unFollowUser);
    }
  );
};

exports.getAllPostsOfFollowing = (req, res) => {
  Post.find({ author: req.profile.following }, { photo: 0 })
    .sort({ createdAt: -1 })
    .populate("author", "fullname  username")
    .populate("comments")
    .exec((error, posts) => {
      if (error || !posts) {
        return res.status(400).json({
          error: "No posts found",
        });
      }
      return res.json(posts);
    });
};
