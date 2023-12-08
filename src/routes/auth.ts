import * as bcrypt from "bcrypt";
import "dotenv/config";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db";
import useValidator from "../utils/useValidator";
import { UserCreateValidator } from "../validators/users";

const authRouter = express.Router();

authRouter.post("/signIn", async function (req, res) {
  const { email, password } = req.body;

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      throw new Error();
    }

    const isSamePassword = await bcrypt.compare(password, foundUser.password);

    if (!isSamePassword) throw new Error();

    const token = jwt.sign(
      { user: foundUser },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
});

authRouter.post(
  "/signUp",
  UserCreateValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      const { email, password } = req.body;

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

        return res
          .status(200)
          .json({ message: "User successfully created !", user: user });
      } catch (error) {
        return res.status(404).json({ error });
      }
    });
  }
);

export default authRouter;
