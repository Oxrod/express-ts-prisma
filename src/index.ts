import "dotenv/config";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import limiter from "./middlewares/ratel-imit";
import authRouter from "./routes/auth";
import ordersRouter from "./routes/orders";
import productRouter from "./routes/products";
import userRouter from "./routes/users";
import prisma from "./utils/db";
import "./utils/passport";

async function main() {
  const app = express();
  app.use(passport.initialize());

  app.use(helmet());
  app.use(limiter);
  // app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/auth", authRouter);

  app.use(
    "/orders",
    passport.authenticate("jwt", { session: false }),
    ordersRouter
  );
  app.use(
    "/products",
    passport.authenticate("jwt", { session: false }),
    productRouter
  );
  app.use(
    "/users",
    passport.authenticate("jwt", { session: false }),
    userRouter
  );

  app.listen(process.env.APP_PORT, () =>
    console.log(
      `Server running on http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT} !`
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
