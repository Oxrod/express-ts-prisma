"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUpdateValidator = exports.OrderCreateValidator = void 0;
const express_validator_1 = require("express-validator");
exports.OrderCreateValidator = [
    (0, express_validator_1.check)("orderItems")
        .isArray()
        .withMessage("orderItems must be an array of type OrderItem[]")
        .bail()
        .notEmpty()
        .withMessage("orderItems must not be empty"),
    (0, express_validator_1.check)("orderItems.*.productId")
        .trim()
        .isNumeric()
        .bail()
        .withMessage("Incorrect productId"),
    (0, express_validator_1.check)("orderItems.*.quantity")
        .trim()
        .isNumeric()
        .bail()
        .withMessage("Incorrect quantity"),
];
exports.OrderUpdateValidator = exports.OrderCreateValidator;
