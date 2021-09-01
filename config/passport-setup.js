const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('./keys')
const myURL = require('./myURL').myURL
const User = require('../models/users')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //option for gg strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: `${myURL}auth/google/callback`

    }, async (accessToken, refreshToken, profile, done) => {
        //passport callback func
        await User.findOne({ userId: profile.id, accountType: 'google' }).then((currentUser) => {

            //check if user already exist in  DB
            if (currentUser) {
                //user exist
                console.log('account ID ' + profile.id + ' already exist')
                done(null, currentUser)
            }
            else {
                // if not, create a new user
                console.log('create user');
                new User({
                    accountType: 'google',
                    userId: profile.id,
                    name: profile.displayName,
                    avtURL: profile.photos[0].value
                }).save().then((newUser) => {
                    console.log('new user created')
                    done(null, newUser)
                })
            }
        })
    })
)

passport.use(
    new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: `${myURL}auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'picture.type(large)']
    }, async (accessToken, refreshToken, profile, done) => {
        //passport callback func
        await User.findOne({ userId: profile.id, accountType: 'facebook' }).then((currentUser) => {
            //check if user already exist in  DB
            if (currentUser) {
                //user exist
                console.log(profile.id + ' already exist')
                done(null, currentUser)
            }
            else {
                // if not, create a new user
                new User({
                    accountType: 'facebook',
                    userId: profile.id,
                    name: profile.displayName,
                    avtURL: profile.photos[0].value,
                    boards: []
                }).save().then((newUser) => {
                    console.log('new user created')
                    done(null, newUser)
                })
            }
        })
    })
)