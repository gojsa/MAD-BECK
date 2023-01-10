const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = db.users;

const protect = asyncHandler(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from headers
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decode = jwt.decode(token, process.env.JWT_SECRET);


      //Get user from token
      let attributes = ['users_id', 'user_name', 'email']
      User.findByPk(decode.id, {
        attributes
      })
        .then(user => {
          req.user = user;
          next();
          return;
        });

    } catch (error) {
      res.status(401);
      throw new Error('User is not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('User is not authorized, no token')
  }

});


module.exports = { protect };