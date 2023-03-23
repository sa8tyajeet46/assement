const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncError = require("./../middleware/catchAsyncErrror");
const User = require("./../models/userModels");
const { sendToken } = require("../middleware/sendToken");

// const cloudinary = require("cloudinary");

const jwt = require("jsonwebtoken");

exports.signup = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) return next(new ErrorHandler("Email required", 401));
  if (password.toString().length < 8)
    return next(new ErrorHandler("password must be 8 characters long", 401));
  if (password !== confirmPassword)
    return next(
      new ErrorHandler("password must be same as confirm password", 401)
    );

  const existinguser = await User.findOne({ email });

  if (existinguser)
    return next(new ErrorHandler("Email already registered", 401));

  const user = await User.create({
    email,
    password,
  });
  req.user = user;
  sendToken(201, user, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("please Enter Email and Password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Wrong User or Password", 401));

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    return next(new ErrorHandler("Wrong User or Password", 401));
  req.user = user;
  sendToken(200, user, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({
    sucess: true,
  });
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    sucess: true,
    user,
  });
});
