require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const { generatedError } = require("./middleware/error");

// DB connection
require("./models/database").connectedDatabase();

// logger
const logger = require("morgan");
app.use(logger("tiny"));

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");


app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use(cookieparser());

// routes
app.use("/", require("./routes/indexRoutes"));


// Error Handling
const ErrorHandler = require("./utils/ErrorHnadler");
app.all( "*" , (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});

// generated error
app.use(generatedError);

app.listen(
  process.env.PORT,
  console.log(`server is running on port ${process.env.PORT}`)
);
