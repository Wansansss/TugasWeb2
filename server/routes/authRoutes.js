// mengimport library
const express = require("express");
const router = express.Router();
const ControllerUser = require("../controllers/controllerUser");
const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

router.get("/register", ControllerUser.submitRegister);
router.post("/register", ControllerUser.submitRegisterOnPost);
router.get("/login", ControllerUser.submitLogin);
router.post("/login", ControllerUser.submitLoginOnPost);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        fullName:profile.displayName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// jika gagal login menggunakan google maka tampilkan ini
router.get("/login-failuer", (req, res) => {
  res.send("Something went wrong....");
});


// membuat fungsi menghapus user session
router.get('/logout',(req,res) =>{
    req.session.destroy(error =>{
        if(error){
            console.log(error);
            res.send("Connection Error");
        }else{
            res.redirect('/login');
        }
    });
})


// prsist user data setelah sukses authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// retrive user data from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;
