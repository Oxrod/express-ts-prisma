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
const useValidator_1 = __importDefault(require("../utils/useValidator"));
const orders_1 = require("../validators/orders");
const params_1 = require("../validators/params");
const ordersRouter = express_1.default.Router();
ordersRouter.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield db_1.default.order.findMany({
                include: {
                    user: true,
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return res.status(200).json(orders);
        }
        catch (error) {
            return res.status(404).json({ error });
        }
    });
});
ordersRouter.get("/:id", params_1.ParamsIdValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield db_1.default.order.findUnique({
                    where: {
                        id: parseInt(req.params.id),
                    },
                    include: {
                        orderItems: true,
                    },
                });
                return res.status(200).json(order);
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({ error });
            }
        }));
    });
});
ordersRouter.post("/", orders_1.OrderCreateValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            const { orderItems } = req.body;
            const jwtUser = req.user;
            try {
                const order = yield db_1.default.order.create({
                    data: {
                        userId: jwtUser.id,
                        orderItems: {
                            create: orderItems,
                        },
                    },
                });
                return res
                    .status(200)
                    .json({ message: "Order successfully created !", order });
            }
            catch (error) {
                return res.status(404).json({ error });
            }
        }));
    });
});
ordersRouter.patch("/:id", params_1.ParamsIdValidator, orders_1.OrderUpdateValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            const { orderItems } = req.body;
            try {
                const dbUser = yield db_1.default.order.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                if (!dbUser) {
                    throw new Error("Invalid id");
                }
                yield db_1.default.orderItem.deleteMany({
                    where: {
                        orderId: parseInt(id),
                    },
                });
                const updatedOrder = yield db_1.default.order.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        orderItems: {
                            create: orderItems,
                        },
                    },
                    include: {
                        orderItems: true,
                    },
                });
                return res.status(200).json(updatedOrder);
            }
            catch (error) {
                return res.status(421).json({ error });
            }
        }));
    });
});
ordersRouter.delete("/:id", params_1.ParamsIdValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        return (0, useValidator_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield db_1.default.order.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                if (!order) {
                    throw new Error("Invalid id");
                }
                yield db_1.default.order.delete({
                    where: {
                        id: order.id,
                    },
                });
                return res
                    .status(200)
                    .json({ message: "Order successfully deleted", order });
            }
            catch (error) {
                return res.status(421).json({ error });
            }
        }));
    });
});
exports.default = ordersRouter;
