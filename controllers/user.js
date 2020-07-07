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

exports.getAllUsers = (req, res) => {
  User.find({}, { encry_password: 0, salt: 0 }).exec((error, users) => {
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


exports.userPosts = (req, res)=>{
    Post.find({author:req.profile._id})
    .populate("author","_id fullname") //pass field name and which fileds want to get
    .exec((error , posts)=>{
        if (error) {
            return res.status(400).json({
                error : "No post found"
            })
        }
        return res.json(posts)
    })
}

