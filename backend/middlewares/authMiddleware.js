const passportJWT = require("passport-jwt");
const secret = process.env.JWT_SECRET;
const passport = require("passport");
const User = require("../models/user");

const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const opts = {};
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = authMiddleware = passport.use(
  new jwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);