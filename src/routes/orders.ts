import { User } from "@prisma/client";
import express, { Request, Response } from "express";
import prisma from "../utils/db";
import useValidator from "../utils/useValidator";
import {
  OrderCreateValidator,
  OrderUpdateValidator,
} from "../validators/orders";
import { ParamsIdValidator } from "../validators/params";

const ordersRouter = express.Router();

ordersRouter.get("/", async function (req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
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
  } catch (error) {
    return res.status(404).json({ error });
  }
});

ordersRouter.get(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      try {
        const order = await prisma.order.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
          include: {
            orderItems: true,
          },
        });

        return res.status(200).json(order);
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error });
      }
    });
  }
);

ordersRouter.post(
  "/",
  OrderCreateValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      const { orderItems } = req.body;

      const jwtUser = req.user as User;

      try {
        const order = await prisma.order.create({
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
      } catch (error) {
        return res.status(404).json({ error });
      }
    });
  }
);

ordersRouter.patch(
  "/:id",
  ParamsIdValidator,
  OrderUpdateValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      const { orderItems } = req.body;

      try {
        const dbUser = await prisma.order.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!dbUser) {
          throw new Error("Invalid id");
        }

        await prisma.orderItem.deleteMany({
          where: {
            orderId: parseInt(id),
          },
        });
        const updatedOrder = await prisma.order.update({
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
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

ordersRouter.delete(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      try {
        const order = await prisma.order.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!order) {
          throw new Error("Invalid id");
        }

        await prisma.order.delete({
          where: {
            id: order.id,
          },
        });

        return res
          .status(200)
          .json({ message: "Order successfully deleted", order });
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

export default ordersRouter;
