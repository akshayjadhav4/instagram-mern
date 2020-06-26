const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "No user found",
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
