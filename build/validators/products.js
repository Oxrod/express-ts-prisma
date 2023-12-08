"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUpdateValidator = exports.ProductCreateValidator = void 0;
const express_validator_1 = require("express-validator");
exports.ProductCreateValidator = [
    (0, express_validator_1.check)("name").notEmpty().withMessage("Product Name must not be empty"),
    (0, express_validator_1.check)("price")
        .notEmpty()
        .withMessage("Product Price must be specified")
        .bail()
        .isNumeric()
        .withMessage("Product Price must be a number"),
];
exports.ProductUpdateValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Product Name must not be empty")
        .optional(),
    (0, express_validator_1.check)("price")
        .isNumeric()
        .withMessage("Product Price must be a number")
        .optional(),
];
