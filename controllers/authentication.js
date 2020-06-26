const User = require("../models/user")
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { validationResult  } = require('express-validator');

exports.signup = (req ,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
        param: errors.array()[0].param,
      });
    }

    const user = new User(req.body)
    user.save((error , user)=>{
        if (error) {
            return res.status(400).json({
                error : "Not able to create account "
            })
        }
        res.json(user)
    })
}


exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User account does not exists...",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not match",
      });
    }

    //CREATE TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // PUT TOKEN IN COOKIE
    res.cookie("token", token, { expire: new Date() + 9999 });
    //SEND RESPONSE TO FRONTEND
    const { _id, fullname, username, email, role } = user;
    return res.json({ token, user: { _id, fullname, username, email, role } });
  });
};


exports.signout = (req,res)=>{
  //clear cookie
  res.clearCookie("token")
  res.json({
    message : "User signout successfully"
  })
}