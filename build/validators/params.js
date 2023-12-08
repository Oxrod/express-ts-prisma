"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsIdValidator = void 0;
const express_validator_1 = require("express-validator");
exports.ParamsIdValidator = [(0, express_validator_1.param)("id").notEmpty().isNumeric()];
