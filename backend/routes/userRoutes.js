const express = require("express");
const {
  signup,
  login,
  logout,
  getUserDetails,
} = require("./../controller/userContoller");
const { isAuthenticated, AuthorizedRoles } = require("../middleware/Auth");
const userRouter = express.Router();

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/auth/me").get(isAuthenticated, getUserDetails);

module.exports = userRouter;
