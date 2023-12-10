const { catchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHnadler");
const Student = require("../models/studentModel");
const { sendtoken } = require("../utils/sendtoken");
const { sendmail } = require("../utils/nodemailer");

exports.homepage = catchAsyncError(async (req, res, next) => {
  res.json({ message: "homepage this is  protected page" });
});

exports.currentUser = catchAsyncError(async (req, res, next) => {
  const student = await Student.findById(req.body).exec();
  res.json(student);
});

exports.studentsignup = catchAsyncError(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student, 201, res);
});

exports.studentsignin = catchAsyncError(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!student)
    return next(
      new ErrorHandler("User is not found with this email address", 404)
    );
  const isMatch = student.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("Wrong password", 505));
  sendtoken(student, 200, res);
});

exports.studentsignout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");

  res.json({ message: "Successfully signout" });
});

exports.studentsendmail = catchAsyncError(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).exec();
  if (!student) {
    return next(new ErrorHandler("user is not found with this email address"));
  }

  const url = `${req.protocol}://${req.get(
    "host"
  )}/student/forgot-password-url/${student._id}`;

  sendmail(req, res, next, url);
  student.resetPasswordToken = "1";
  await student.save();
  res.json({ student, url });
});

exports.studentforgetlink = catchAsyncError(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  if (!student) {
    return next(
      new ErrorHandler("user is not found with this email address", 400)
    );
  }

  if (student.resetPasswordToken == "1") {
    student.resetPasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  } else {
    return next(new ErrorHandler("invalid reset link! please try again", 500));
  }
  res.status(200).json({
    message: "Password has been changed successfully ",
  });
});

exports.studentresetpassword = catchAsyncError(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  console.log(student, "hello");
  student.password = req.body.password;
  await student.save();
  sendtoken(student, 201, res);
});
exports.studentupdate = catchAsyncError(async (req, res, next) => {
  const student= await Student.findByIdAndUpdate(req.params.id, req.body).exec();
 
  res.status(200).json({
    success: true,
    message: "Student details updated!",
    student 
  });
});
