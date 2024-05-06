// Import modul Libaray dari npm yang sebelumnya sudah di install

require("dotenv").config();
require("./server/models/database");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const recipeRouter = require("./server/routes/recipeRoutes");
const userRouter = require("./server/routes/authRoutes");
const adminRouter = require("./server/routes/adminRoutes");
const dashboard = require("./server/routes/dashboard");
// import end

// memakai librari yang di import sebelumnya untuk keperluan backend
const app = express();
const port = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    // setting expires session cookie
    cookie: {
      maxAge: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(cookieParser("cookies"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use(recipeRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(dashboard);


// handle error not-found
app.get('*', function(req, res){
  res.status(404).render('404');
})
// membuat server untuk user interface
app.listen(port, () => console.log(`Listening to port ${port}`));
