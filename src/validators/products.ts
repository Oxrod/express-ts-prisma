import { check } from "express-validator";

export const ProductCreateValidator = [
  check("name").notEmpty().withMessage("Product Name must not be empty"),
  check("price")
    .notEmpty()
    .withMessage("Product Price must be specified")
    .bail()
    .isNumeric()
    .withMessage("Product Price must be a number"),
];

export const ProductUpdateValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product Name must not be empty")
    .optional(),
  check("price")
    .isNumeric()
    .withMessage("Product Price must be a number")
    .optional(),
];
