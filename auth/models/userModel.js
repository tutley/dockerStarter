const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "User must have an email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "User must have a password"],
  },
  created: {
    type: Date,
  },
  lastModified: {
    type: Date,
  },
  firstName: {
    type: String,
    require: [true, "User must have a first name"],
  },
  lastName: {
    type: String,
    require: [true, "User must have a last name"],
  },
  emailValid: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String,
  },
});

// Sets the created parameter equal to the current time
userSchema.pre('save', function (next) {
  now = new Date();
  this.lastModified = now;
  if (!this.created) {
    this.created = now
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
