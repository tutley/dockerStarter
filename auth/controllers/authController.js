const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const qs = require('qs');

// setting things up for emailing later
var transportConfig = {
  host: 'some.smtp.com',
  port: 465,
  secure: true,
  auth: {
    user: 'yourusername',
    pass: process.env.EMAIL_PASSWORD,
  }
}
if (process.env.NODE_ENV === 'development') {
  transportConfig = {
    host: 'mailslurper',
    port: 2500,
    secure: false,
  }
}


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({
        message: "User was not found in the system.",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      const accessToken = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '15m'});
      const refreshToken = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '24h'})
      // pop the password off before sending back the user profile
      var profile = Object.assign({}, user, {password: undefined, emailVerificationCode:''});

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile,
      });

    } else {
      res.status(400).json({
        message: "Incorrect email or password.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "Not sure what happened there",
    });
  }
};

exports.refresh = async (req, res) => {
  const requestToken = req.body.refresh_token;
  const { TokenExpiredError } = jwt;

  if (requestToken == null) return res.status(403).send({message: "No token provided"});

  jwt.verify(requestToken, process.env.TOKEN_SECRET, (err, email) => {
    console.log(err)
  
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(403).send({ message: "Unauthorized! Refresh Token has expired!"});
      }
      return res.status(401).send({ message: "Not sure what happened there"});
    }

    // grant another 15 minutes
    const accessToken = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '15m'});

    res.status(200).json({
      accessToken: accessToken,
      profile: null,
    })

  });
};

exports.checkzip = async (req, res) => {
  const zip = req.body.zip;
  if (zip) {
    var data = qs.stringify({
      'zip': req.body.zip
    });
    var config = {
      method: 'post',
      url: 'https://tools.usps.com/tools/app/ziplookup/cityByZip',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        let result = {
          city: response.data.defaultCity,
          state: response.data.defaultState,
        };
        res.status(201).json(result);
      })
      .catch(function (error) {
        console.log(error);
        res.status(200);
      });


  } else {
    res.status(200);
  }
}

exports.signUp = async (req, res) => {
  const { 
    email, 
    firstName, 
    lastName } = req.body;
  const newPassword = req.body.password;

  // email verification token expires in 14 days
  const verifyCode = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '14d'});

  var baseURL = (process.env.NODE_ENV === 'production') ? 'https://domain.com/': 'http://localhost:8000/';
  const emailLink = baseURL + 'signup/complete/' + verifyCode;
  const emailHTML = `<b>Hi ${firstName},</b>
  <br><br>
  This is your account verificaiton email.<br><br>
  <a href="${emailLink}">Click here to verify your email address</a> and 
  login to your new account!<br><br>
  Sincerely,<br>
  The Management`;

  const emailText = `Hello ${firstName},\n\nThis is your account verification email.
  Please copy and paste the below URL, in its entirety, to your favorite web browser, and enjoy!\n\n
  ${emailLink}\n\nSincerely,\nThe Management.`;

  try {
    let transporter = nodemailer.createTransport(transportConfig);

    let emailCode = await transporter.sendMail({
      from: '"System" <system@domain.com>',
      to: email,
      subject: "Your Account Verification Email",
      text: emailText,
      html: emailHTML,
    });
    console.log('email code', emailCode);
    const hashpassword = await bcrypt.hash(newPassword, 12);
    const newUser = await User.create({
      email,
      password: hashpassword,
      firstName,
      lastName,
      emailVerificationCode: verifyCode,
    });

    res.status(201).json({
      profile: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (e) {
    // if mongo fails unique validation for the email field, it should return e.code of 11000
    if (e.code === 11000) {
      return res.status(409).json({
        message: "Error: user with that email is already registered.",
        email: email,
      });
    }
    console.log(e)
    res.status(400).json({
      message: "not sure why but user creation did not work"
    });
  }
};

exports.resendVerification = async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({
        message: "The User was not found.",
      });
    }

    const verifyCode = user.emailVerificationCode;
    const firstName = user.firstName;
    var baseURL = (process.env.NODE_ENV === 'production') ? 'https://domain.com/' : 'http://localhost:8000/';
    const emailLink = baseURL + 'signup/complete/' + verifyCode;
    const emailHTML = `<b>Hi ${firstName},</b>
    <br><br>
    This is your account verificaiton email.<br><br>
    <a href="${emailLink}">Click here to verify your email address</a> and 
    login to your new account!<br><br>
    Sincerely,<br>
    The Management`;

    const emailText = `Hello ${firstName},\n\nThis is your account verification email.
    Please copy and paste the below URL, in its entirety, to your favorite web browser, and enjoy!\n\n
    ${emailLink}\n\nSincerely,\nThe Management.`;

    let transporter = nodemailer.createTransport(transportConfig);

    transporter.sendMail({
      from: '"System" <system@domain.com>',
      to: email,
      subject: "Your Account Verification Email",
      text: emailText,
      html: emailHTML,
    }, function(err, info) {
      if (err) {
        res.status(400).json({
          message: "The email server failed to send the message.",
        });
        console.log(err);
      } else {
        res.status(200).json({});
      }
    });

  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Not sure what happened there, but we couldn't re-send the email",
    });
  }
  

};

// Verify the email verification code and then create login tokens so user is logged in
exports.verifyEmail = async (req, res) => {
  const emailToken = req.body.emailVerificationCode;
  const { TokenExpiredError } = jwt;

  if (emailToken == null) return res.status(403).send({message: "No verification code provided"});
  var email = null;

  try {
    const tokenEmail = jwt.verify(emailToken, process.env.TOKEN_SECRET)
    email = tokenEmail.email;
  } catch (err) {
    console.log(err)
    if (err instanceof TokenExpiredError) {
      // TODO: Delete user from the database and change the error message to re-register
      return res.status(403).send({ message: "Unauthorized! Email verification has expired!"});
    }
    return res.status(401).send({ message: "There was an undefined error in the email verification code"});

  }

  // update the user profile to remove the verification code and change the verified status
  // then return user profile and login tokens
  const filter = { email }
  const update = {
    emailVerificationCode: '',
    emailValid: true,
  }

  try {
    const user = await User.findOneAndUpdate(filter, update, { new:true, lean:true });

    // 1 hour and 24 hours
    const accessToken = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign({email:email}, process.env.TOKEN_SECRET, {expiresIn: '24h'})
    // pop the password off before sending back the user profile
    var profile = Object.assign({}, user, {password: undefined});
    
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile,
    });
  } catch(e){
    console.log(e);
    res.status(400).json({
      message: "There was a problem finishing the email verification process.",
    });
  }

};

// finish the signup process by adding to the user profile
// also just allow profile updates at user request
exports.updateProfile = async (req, res) => {
  const email = req.email;
  const {
    firstName,
    lastName,
    } = req.body;

  const filter = { email: email};
  const update = { firstName, lastName };
  try {
    const updatedUser = await User.findOneAndUpdate(filter, update, { new: true, lean: true });

    var profile = Object.assign({}, updatedUser, {password: undefined});
    res.status(201).json({
      profile: profile,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "There was a problem updating the user profile."
    });
  }

};

// fetch the user profile only
exports.getProfile = async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found in the system.",
      });
    }

    // pop the password off before sending back the user profile
    var profile = Object.assign({}, user, { password: undefined, emailVerificationCode: ''});
    
    res.status(200).json({
      profile: profile,
    });

  } catch (e) {
        res.status(400).json({

      message: "Not sure what happened there, but we couldn't get the user profile",
    });
  }
};