// require
require("../models/database");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
/**
 * GET /register
 * register (mengambil tampilan dari /register)
 */
exports.submitRegister = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("register", {
    layout: "../views/layouts/login",
    title: "Cooking Blog - Register",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-user
 * Submit user (menambahkan data user ke db berdasarkan apa yang di input user )
 */

exports.submitRegisterOnPost = async (req, res) => {
  const newUser = await User({
    email: req.body.Email,
    username: req.body.Username,
    password: req.body.Password,
  });
  // cek apakah user sudah ada di database
  const exisitingUser = await User.findOne({ username: newUser.username });
  // pengkodisian jika ada
  if (exisitingUser) {
    req.flash("infoSubmit", "User already exists.");
    res.redirect("/register");
  } else {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    const NewUser = await User.insertMany(newUser);
    req.flash("infoSubmit", "Registration Completed.");
    res.redirect("/login");
    console.log(NewUser);
  }
};
/**
 * GET /login
 * register (mengambil tampilan untuk login)
 */
exports.submitLogin = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("login", {
    layout: "../views/layouts/login",
    title: "Cooking Blog - Login",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-login
 * Submit user (cek data user di db berdasarkan apa yang di input user )
 */
exports.submitLoginOnPost = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) {
    req.flash("infoSubmit", "User not found.");
    res.redirect("/login");
  } else {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      req.flash("infoSubmit", "Invalid Password.");
      res.redirect("/login");
    } else {
      req.session.user = user;
      req.flash("infoSubmit", "Berhasil");
      res.redirect("/dashboard");
    }
  }
};

exports.getdashboard = async (req, res) => {
  let perPage = 12;
  // let page = req.query.page || 1;
  try {
    // Recipe.aggregate([
    //   {
    //     $sort: {
    //       createdAt: -1,
    //     },
    //   },
    //   {
    //     $match: {
    //       user: mongoose.Types.ObjectId(req.user.id),
    //     },
    //   },
    //   {
    //     $project: {
    //       name: {$substr: ["$name", 0, 30] },
    //       image: {$substr: ['$image', 0, 100] },
    //     },
    //   },
    // ])
    //   .skip(perPage * page - perPage)
    //   .limit(perPage)
    //   .exec(function (err, recipe) {
    //     Recipe.count().exec(function (err, count) {
    //       if (err) return next(err);
    //       res.render("user/dashboard", {
    //         recipe,
    //         fullName: req.user.fullName,
    //         title: "User Dashboard",
    //         layout: "../views/layouts/main",
    //         current: page,
    //         page: Math.ceil(count / perPage),
    //       });
    //     });
    //   });
    Recipe.find({})
      .exec(function (err, recipe) {
        if (err) return next(err);
        res.render("user/dashboard", {
          recipe,
          fullName: req.user.fullName,
          title: "User Dashboard",
          layout: "../views/layouts/main",
        });
      });
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 */
