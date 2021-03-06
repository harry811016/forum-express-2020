const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const db = require("./models");
const app = express();
const port = process.env.PORT || 3000;
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const helpers = require("./_helpers");

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers"),
  })
);
app.set("view engine", "handlebars"); // 設定使用 Handlebars 做為樣板引擎
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/upload", express.static(__dirname + "/upload"));

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = helpers.getUser(req);
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req);
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require("./routes")(app, passport);

module.exports = app;
