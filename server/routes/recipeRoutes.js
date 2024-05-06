// mengimport library
require("../models/database");
const express = require("express");
const router = express.Router();
const ControllerRecipe = require("../controllers/controllerRecipe");
const multer = require("multer");
const Recipe = require("../models/Recipe")
const {isLoggedIn} = require("../middleware/checkAuth")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + "_" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
}).single("image");

/**
 * App Routes (Mengambil semua file)
 */
router.get("/",isLoggedIn,ControllerRecipe.homepage);
router.get("/recipe/:id", isLoggedIn, ControllerRecipe.exploreRecipe);
router.get("/categories",isLoggedIn, ControllerRecipe.exploreCategories);
router.get("/categories/:id",isLoggedIn, ControllerRecipe.exploreCategoriesById);
router.post("/search",isLoggedIn, ControllerRecipe.searchRecipe);
router.get("/explore-latest",isLoggedIn, ControllerRecipe.exploreLatest);
router.get("/explore-random",isLoggedIn, ControllerRecipe.exploreRandom);
router.get("/populer",isLoggedIn, ControllerRecipe.populer);
router.get("/submit-recipe",isLoggedIn,ControllerRecipe.submitRecipe)
// router.post("/submit-recipe",upload,ControllerRecipe.submitRecipeOnPost);
router.post("/submit-recipe", upload, (req, res) => {
  const newRecipe = new Recipe({
      email: req.body.email,
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: req.file.filename,
    })
     newRecipe.save((err)=>{
      if(err){
        console.log(err)
      }else{
        req.flash("infoSubmit", "Recipe has been added.");
        res.redirect('/submit-recipe')
      }
     })
   
})
// router.post('/logout',passport.authenticate('local'),ControllerUser.submitLogout)

module.exports = router;
