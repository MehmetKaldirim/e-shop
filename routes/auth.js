const express = require("express");

const expValidator = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    expValidator
      .body("email")
      .isEmail()
      .withMessage("Please entere a valid address"),
      expValidator
      .body("password","Please enter a password with only numbers and text and at least 5 characters")
      .isLength({min:5}).isAlphanumeric()
      .withMessage("Please entere a valid address"),

  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    expValidator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one"
            );
          }
        });
      }),
    expValidator
      .body(
        "password",
        "Please enter a password with only numbers and text and at least 5 characters"
      )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    expValidator
      .body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
