import { check } from "express-validator";

export const UserUpdateValidator = [
  check("email").isEmail().withMessage("You must specify a valid email"),
];

export const UserCreateValidator = [
  check("email").isEmail().withMessage("You must specify a valid email"),
  check("password")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("You must enter a valid password")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
