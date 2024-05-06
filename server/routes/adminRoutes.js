const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const fs = require("fs");
const multer = require("multer");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "-" + Date.now() + file.originalname);
  },
});
var upload = multer({
  storage: storage,
}).single("image");

router.get("/admin", async (req, res) => {
  try {
    const user = await User.find({}).limit(1);
    const limitNumber = 5;
    const recipe = await Recipe.find({});
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");

    res.render("admin/index", {
      title: "Cooking Blog - Admin",
      user,
      infoSubmitObj,
      infoErrorsObj,
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
});
router.get("/edit/:id", async (req, res) => {
  let recipeId = req.params.id;
  //   const user = await User.find({}).limit(1);
  Recipe.findById(recipeId, (error, recipe) => {
    if (error) {
      req.flash("infoErrors", "Couldn't find recipe");
      res.status(500).send({ message: error.message || "Error Occured" });
    } else {
      if (recipe === null) {
        res.redirect("admin/index");
      } else {
        res.render("admin/edit-recipe", {
          title: "Cooking Blog - Edit Recipe",
          recipe,
        });
      }
    }
  });
});
router.post("/update/:id", upload, async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("uploads/" + req.params.image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  console.log(req.body.email)
  Recipe.findByIdAndUpdate(
    id,
    {
      email: req.body.email,
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
        console.log(err);
      } else {
        req.flash("infoSubmit", "Recipe has been updated successfully");
        res.redirect("/admin");
      }
    }
  );
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Recipe.findByIdAndDelete(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Recipe has been deleted",
      };
      res.redirect("/admin");
    }
  });
});

module.exports = router;
