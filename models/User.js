var mongoose = require('mongoose')
  , _ = require('underscore')
  , bCrypt = require('bCrypt')
  , uuid = require('node-uuid')
  , SALT_WORK_FACTOR = 10;
/**
 * A User Schema for providing authentication to RESTful API
 */
var UserSchema = new mongoose.Schema({
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String, required: true, select: false},
  token: String
});
/**
 * Saving with a SALTed Hash of password
 */
UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  // generate a salt
  bCrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    // hash the password along with our new salt
    bCrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      // override the clear-text password with the hashed one
      user.password = hash;
      next();
    });
  });
});
/**
 * Convenience method for comparing provided password with hashed password
 * @param candidatePassword
 * @param callback
 */
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bCrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};
/**
 * Login convenience method
 */
UserSchema.static('login', function(credentials, callback) {
  return this.findOne({ username: credentials.username }, function(err, User) {
    if (err) {
      return callback(err);
    }
    User.comparePassword(credentials.password, function(err, isMatch) {
      if (!err && isMatch) {
        var token = uuid.v2();
        User.set('token', token).save(function(err) {
          callback(null, token);
        });
      } else {
        callback(err, {});
      }
    });
  });
});
/**
 * Auth using time based token
 */
UserSchema.static('auth', function(token, callback) {
  this.findOne({token: token}, callback);
});
module.exports = mongoose.model("RESTING_MOGOOSE_API_User", UserSchema);
