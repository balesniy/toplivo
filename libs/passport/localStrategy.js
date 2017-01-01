const Auth0Strategy = require('passport-auth0');

module.exports = new Auth0Strategy({
  domain:       'balesniy.eu.auth0.com',
  clientID:     'DuFCvvnVdQU2dd2hJeA7JDEMykCT3tib',
  clientSecret: 'ebwCCzLPkqGvIvNXTo4wMxnJD-I7Ya3XP5RV0REBi0wRqyM2QsqGmb6yUM9VICDx',
  callbackURL:  'https://secret-tundra-34211.herokuapp.com/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});
