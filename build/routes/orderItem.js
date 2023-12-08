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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../utils/db"));
const productRouter = express_1.default.Router();
productRouter.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield db_1.default.product.findMany();
            return res.status(200).json(products);
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    });
});
productRouter.get("/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield db_1.default.product.findUnique({
                where: {
                    id: parseInt(req.params.id),
                },
            });
            return res.status(200).json(product);
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    });
});
productRouter.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, price } = req.body;
        try {
            const product = yield db_1.default.product.create({
                data: {
                    name,
                    price,
                },
            });
            return res
                .status(200)
                .json({ message: "Product successfully created !", product });
        }
        catch (error) {
            console.log(error);
            return res.status(404).json({ error });
        }
    });
});
productRouter.patch("/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const product = req.body;
        try {
            const dbUser = yield db_1.default.product.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!dbUser) {
                throw new Error("Invalid id");
            }
            const updatedProduct = yield db_1.default.product.update({
                where: {
                    id: dbUser.id,
                },
                data: product,
            });
            return res.status(200).json(updatedProduct);
        }
        catch (error) {
            return res.status(421).json({ error });
        }
    });
});
productRouter.delete("/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const product = yield db_1.default.product.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!product) {
                throw new Error("Invalid id");
            }
            yield db_1.default.product.delete({
                where: {
                    id: product.id,
                },
            });
            return res
                .status(200)
                .json({ message: "Product successfully deleted", product });
        }
        catch (error) {
            return res.status(421).json({ error });
        }
    });
});
exports.default = productRouter;
