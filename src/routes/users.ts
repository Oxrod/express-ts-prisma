import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import prisma from "../utils/db";
import useValidator from "../utils/useValidator";
import { ParamsIdValidator } from "../validators/params";
import { UserCreateValidator, UserUpdateValidator } from "../validators/users";

const userRouter = express.Router();

userRouter.get("/", async function (req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
});

userRouter.get(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error });
      }
    });
  }
);

userRouter.post(
  "/",
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

        return res.status(200).json({ message: "User successfully created !" });
      } catch (error) {
        return res.status(404).json({ error });
      }
    });
  }
);

userRouter.patch(
  "/:id",
  ParamsIdValidator,
  UserUpdateValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      const { password, ...userToUpdate } = req.body;
      try {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!dbUser) {
          throw new Error("Invalid id");
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: userToUpdate,
        });

        return res.status(200).json(updatedUser);
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

userRouter.delete(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!user) {
          throw new Error("Invalid id");
        }

        await prisma.user.delete({
          where: {
            id: user.id,
          },
        });

        return res.status(200).json({ message: "User successfully deleted" });
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

export default userRouter;
