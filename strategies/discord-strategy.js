const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
const sequelize = require('../database/DB_connection');
dotenv.config();

let scopes = ['identify', 'email', 'guilds', 'guilds.join', 'gdm.join'];

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: scopes
}, async (accessToken, refreshToken, profile, done) => {
    let user = await sequelize.models.users.findOrCreate({
        where: {
            userID: profile.id
        }
    })
    if (user){
        user = await sequelize.models.users.findOne({
            where: {
                userID: profile.id
            }
        })
        user.profile = profile;
        if (user.email !== profile.email){
            user.email = profile.email;
        }
        await user.save();
    }
    done(null, user)
}));