const express = require("express");
const router = express.Router();
const {
  homepage,
  studentsignup,
  studentsendmail,
  studentsignin,
  studentsignout,
  currentUser,
  studentforgetlink,
  studentresetpassword,
  studentupdate,
} = require("../controllers/indexController");
const { isAuthenicated } = require("../middleware/auth");

// GET  --> /  slacerout
router.get("/", homepage);

// post  --> student
router.post("/student", isAuthenicated, currentUser);

// post/student/signup
router.post("/student/signup", studentsignup);

// post/student/signin
router.post("/student/signin", studentsignin);

// get/student/signout
router.get("/student/signout", studentsignout);

// post/student//send-mail
router.post("/student/send-mail", studentsendmail);

// Get/student/forget-link:studentid
router.get("/student/forgot-password-url/:id", studentforgetlink);

// post/student/reset-password:studentid
router.post(
  "/student/reset-password/:id",
  isAuthenicated,
  studentresetpassword
);
// POST/student/update:studentid
router.post(
  "/student/update/:id",
  isAuthenicated,
  studentupdate
);

module.exports = router;
