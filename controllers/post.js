const Post = require("../models/post");
const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((error, post) => {
    if (error || !post) {
      return res.status(400).json({
        error: `No post found  ${error}`,
      });
    }
    req.post = post;
    next();
  });
};

exports.createPost = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: `ERROR :Image problem ${error}`,
      });
    }

    let post = new Post(fields);

    //file
    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: `File size too big ${error}`,
        });
      }
      post.photo.data = fs.readFileSync(file.photo.path);
      post.photo.contentType = file.photo.type;
    }

    //save to db
    post.save((error, post) => {
      if (error) {
        return res.status(400).json({
          error: `Post creation failed ${error}`,
        });
      }
      User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { userPosts: post._id } },
        { new: true },
        (err, userPosts) => {
          if (err) {
            return res.status(400).json({
              error: "Unable to save post list",
            });
          }
        }
      );
      return res.json(post);
    });
  });
};

exports.getPost = (req, res) => {
  req.post.photo = undefined;
  return res.json(req.post);
};

//middleware to get image
exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
  }
  next();
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((error, deletedPost) => {
    if (error) {
      return res.status(400).json({
        error: `Failed to delete post`,
      });
    }
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $pull: { userPosts: post._id } },
      { new: true },
      (err, userPosts) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to delete post from list",
          });
        }
      }
    );
    return res.json({
      message: `Post deleted`,
    });
  });
};

exports.updatePost = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: `ERROR :Image problem ${error}`,
      });
    }

    //updation code
    let post = req.post;
    post = _.extend(post, fields);
    //file
    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: `File size too big ${error}`,
        });
      }
      post.photo.data = fs.readFileSync(file.photo.path);
      post.photo.contentType = file.photo.type;
    }

    //save to db
    post.save((error, post) => {
      if (error) {
        return res.status(400).json({
          error: `Post updation failed ${error}`,
        });
      }
      return res.json(post);
    });
  });
};

exports.userPostsForExplore = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "_id fullname") //pass field name and which fileds want to get
    .populate("comments")
    .exec((error, posts) => {
      if (error) {
        return res.status(400).json({
          error: "No posts found",
        });
      }
      return res.json(posts);
    });
};

exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $push: { likes: req.profile._id } },
    { new: true }
  )
    .populate("author", "fullname  username")
    .populate("comments")
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({
          error: `Probleam in liking Post ${error}`,
        });
      }
      return res.json(result);
    });
};

exports.unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    { $pull: { likes: req.profile._id } },
    { new: true }
  )
    .populate("comments")
    .populate("author", "fullname  username")
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({
          error: "Probleam in unliking Post",
        });
      }

      return res.json(result);
    });
};
