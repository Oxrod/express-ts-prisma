import { body } from "express-validator";

export const AuthValidator = [
  body("email", "You must specify a valid email").notEmpty().isEmail(),
  body("password", "Incorrect Password").notEmpty().isString(),
];
