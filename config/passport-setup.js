const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('./keys')
const myURL = require('./myURL').myURL
const user = require('../models/users')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    user.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //option for gg strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: `/auth/google/callback`

    }, (accesToken, refreshToken, profile, done) => {
        //passport callback func
        user.findOne({ userId: profile.id, accountType: 'google' }).then((currentUser) => {

            //check if user already exist in  DB
            if (currentUser) {
                //user exist
                console.log(profile.id + ' already exist')
                done(null, currentUser)
            }
            else {
                // if not, create a new user
                new user({
                    accountType: 'google',
                    userId: profile.id,
                    name: profile.displayName,
                    avtURL: profile.photos[0].value,
                    recentBoard: []
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
        callbackURL: `${myURL}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'picture.type(large)']
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        //passport callback func
        user.findOne({ userId: profile.id, accountType: 'facebook' }).then((currentUser) => {
            //check if user already exist in  DB
            if (currentUser) {
                //user exist
                console.log(profile.id + ' already exist')
                done(null, currentUser)
            }
            else {
                // if not, create a new user
                new user({
                    accountType: 'facebook',
                    userId: profile.id,
                    name: profile.displayName,
                    avtURL: profile.photos[0].value,
                    recentBoard: []
                }).save().then((newUser) => {
                    console.log('new user created')
                    done(null, newUser)
                })
            }
        })
    })
)