const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentModel = new mongoose.Schema(
  {
    firstname:{
      type: String,
      required: [true, "First Name is required"],
      minLength:[2,"Fast name should atleast 4 character long"],
    },
    lastname:{
      type: String,
      required: [true, "Last Name is required"],
      minLength:[2,"Last name should atleast 4 character long"],
    },
   
    contact:{
      type: String,
      required: [true, "Contact is required"],
      maxLength:[10,"Contact must not exceed 10 character"],
      minLength:[4,"Contact should atleast 4 character long"],
    },
    city:{
      type: String,
      required: [true, "City is required"],
      minLength:[3,"City should atleast 3 character long"],
    },
    gender:{type:String, enum:["Male","Female","Others"]},
    email: {
      type: String,
      unique: true, //not duplicati
      required: [true, "email is required"],
      match: [
        /^\w+([\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false, //do not show database's password
      maxLength: [15, "password should not exceed more than 15 characters"],
      minLength: [6, "password should have atleast 6 characters"],
      // match:[]
    },
    resetPasswordToken:{
      type:String,
      default:"0",
    },
    avatar:String,
  },
  { timestamps: true }
);

studentModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Student = mongoose.model("student", studentModel);
module.exports = Student;
