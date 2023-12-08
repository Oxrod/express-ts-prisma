"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateValidator = exports.UserUpdateValidator = void 0;
const express_validator_1 = require("express-validator");
exports.UserUpdateValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("You must specify a valid email"),
];
exports.UserCreateValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("You must specify a valid email"),
    (0, express_validator_1.check)("password")
        .trim()
        .notEmpty()
        .isString()
        .withMessage("You must enter a valid password")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
