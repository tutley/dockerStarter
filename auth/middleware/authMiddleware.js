  const jwt = require('jsonwebtoken');

  module.exports.protect = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // console.log('authHeader:', authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    const { TokenExpiredError } = jwt;
    // here we're checking to see if the token is expired or invalid
    const catchError = (err, res) => {
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token has expired!"});
      }
      return res.sendStatus(401).send({ message: "Unauthorized!" });
    }

    if (token == null) return res.status(403).send({message: "No token provided"});
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, obj) => {
      if (err) return catchError(err, res);

      // attach the user's email to the request
      if (obj.email.email) {
        req.email = obj.email.email;
      } else {
        req.email = obj.email;
      }
      next()
    })
  }


  