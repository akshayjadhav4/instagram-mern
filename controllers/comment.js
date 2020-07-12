const Comment = require("../models/comment");
const Post = require("../models/post");


exports.addComment = (req, res) => {
  const comment = new Comment(req.body);
  comment.save((error, comment) => {
    if (error) {
      return res.status(400).json({
        error: "Not able to add comment",
      });
    }
    Post.findOneAndUpdate(
        { _id: req.post._id },
        { $push: { comments: comment._id } },
        { new: true },
        (err, userPosts) => {
          if (err) {
            return res.status(400).json({
              error: "Unable to save post list",
            });
          }
        }
      );
    res.json(comment);
  });
};