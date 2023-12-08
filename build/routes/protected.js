"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const orders_1 = __importDefault(require("./orders"));
const products_1 = __importDefault(require("./products"));
const users_1 = __importDefault(require("./users"));
const protectedRouter = express_1.default.Router();
protectedRouter.use("/", passport_1.default.authenticate("jwt", { session: false }));
protectedRouter.use("/orders", orders_1.default);
protectedRouter.use("/products", products_1.default);
protectedRouter.use("/users", users_1.default);
exports.default = protectedRouter;
