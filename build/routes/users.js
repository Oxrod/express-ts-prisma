"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../utils/db"));
const useValidator_1 = __importDefault(require("../utils/useValidator"));
const params_1 = require("../validators/params");
const users_1 = require("../validators/users");
const userRouter = express_1.default.Router();
userRouter.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield db_1.default.user.findMany({
                select: {
                    email: true,
                },
            });
            return res.status(200).json(users);
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    });
});
userRouter.get("/:id", params_1.ParamsIdValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.user.findUnique({
                    where: {
                        id: parseInt(req.params.id),
                    },
                });
                return res.status(200).json(user);
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({ error });
            }
        }));
    });
});
userRouter.post("/", users_1.UserCreateValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield db_1.default.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });
                return res.status(200).json({ message: "User successfully created !" });
            }
            catch (error) {
                return res.status(404).json({ error });
            }
        }));
    });
});
userRouter.patch("/:id", params_1.ParamsIdValidator, users_1.UserUpdateValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { password } = _a, userToUpdate = __rest(_a, ["password"]);
            try {
                const dbUser = yield db_1.default.user.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                if (!dbUser) {
                    throw new Error("Invalid id");
                }
                const updatedUser = yield db_1.default.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: userToUpdate,
                });
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(421).json({ error });
            }
        }));
    });
});
userRouter.delete("/:id", params_1.ParamsIdValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.user.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                if (!user) {
                    throw new Error("Invalid id");
                }
                yield db_1.default.user.delete({
                    where: {
                        id: user.id,
                    },
                });
                return res.status(200).json({ message: "User successfully deleted" });
            }
            catch (error) {
                return res.status(421).json({ error });
            }
        }));
    });
});
exports.default = userRouter;
