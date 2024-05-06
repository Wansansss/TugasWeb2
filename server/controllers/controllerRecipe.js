require("../models/database");
require('dotenv').config()
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

/**
 * GET /
 * Homepage (menagambil tampilan untuk homepage)
 */
exports.homepage = async (req, res) => {
  try {
    const user = await User.findOne({})
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("user/index", {
      user:req.user,
      title: "Cooking Blog - Home",
      categories,
      food,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories (mengambil tampilan untuk kategori)
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("user/categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id (mencari kategori berdasarkan ID)
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("user/categories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 * Recipe (mengabil resep berdasarkan ID)
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("user/recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search (mengambil input dari user dikolom search lalu mengirim ke database
 * inputan tersebut lalu jika ada dalam databse lalu tampilkan resep tersebut)
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("user/search", { title: "Cooking Blog - Search", recipe});
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explplore Latest (mengabil data resep dari database lalu menampilkan ejs dari explore-latest ke userinterface )
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("user/explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON (mengambil semua resep/kategori dari db lalu mengrandom data tersebut untuk ditampilkan )
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("user/explore-random", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
/**
 * GET /explore-random
 * Explore Random as JSON (mengambil semua yang populer resep/kategori dari db lalu mengrandom data tersebut untuk ditampilkan )
 */
exports.populer = async (req, res) => {
    try {
      const limitNumber = 10;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render("user/populer", {
        title: "Cooking Blog - Explore Latest",
        recipe,
      });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
};

/**
 * GET /submit-recipe
 * Submit Recipe (mengambil tampilan form submit)
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("user/submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

