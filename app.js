let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const session = require("express-session");
let userRouter = require("./routes/user");
let adminRouter = require("./routes/admin");
let app = express();
let multer = require("./multer/multer");
const ConnectMongoDBSession = require("connect-mongodb-session");

require("dotenv").config();

const mongoDbSession = new ConnectMongoDBSession(session);
// Database
let db = require("./model/connection");
const nocache = require("nocache");
// End Database

// Nocahe
app.use(nocache());
// End Nocahe

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE) },
    resave: false,
    saveUninitialized: false,
    store: new mongoDbSession({
      uri: process.env.MONGODB_URI,
      collection: process.env.MONGODB_COLLECTION,
    }),
  })
);
// End Session

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
