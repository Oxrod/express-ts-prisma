import "dotenv/config";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import limiter from "./middlewares/ratel-imit";
import authRouter from "./routes/auth";
import protectedRouter from "./routes/protected";
import prisma from "./utils/db";
import "./utils/passport";

async function main() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(passport.initialize());
  app.use(limiter);
  app.use(helmet());

  app.use("/auth", authRouter);
  app.use("/", protectedRouter);

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
