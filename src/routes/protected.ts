import express from "express";
import passport from "passport";
import ordersRouter from "./orders";
import productRouter from "./products";
import userRouter from "./users";

const protectedRouter = express.Router();

protectedRouter.use("/", passport.authenticate("jwt", { session: false }));

protectedRouter.use("/orders", ordersRouter);
protectedRouter.use("/products", productRouter);
protectedRouter.use("/users", userRouter);

export default protectedRouter;
