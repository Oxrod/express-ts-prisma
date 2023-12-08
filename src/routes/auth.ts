import * as bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db";

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

export default authRouter;
