const User = require("../models/user")
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
