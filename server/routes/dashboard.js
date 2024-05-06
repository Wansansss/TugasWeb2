// import library
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/checkAuth")
const ControllerUser = require("../controllers/controllerUser");

/**
 * Dashboard Routes
 */

router.get('/dashboard',isLoggedIn, ControllerUser.getdashboard)

module.exports = router