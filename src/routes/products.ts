import express, { Request, Response } from "express";
import prisma from "../utils/db";
import useValidator from "../utils/useValidator";
import { ParamsIdValidator } from "../validators/params";
import {
  ProductCreateValidator,
  ProductUpdateValidator,
} from "../validators/products";

const productRouter = express.Router();

productRouter.get("/", async function (req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany();

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
});

productRouter.get(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      try {
        const product = await prisma.product.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        return res.status(200).json(product);
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error });
      }
    });
  }
);

productRouter.post(
  "/",
  ProductCreateValidator,
  async function (req: Request, res: Response) {
    return useValidator(req, res, async () => {
      const { name, price } = req.body;

      try {
        const product = await prisma.product.create({
          data: {
            name,
            price,
          },
        });

        return res
          .status(200)
          .json({ message: "Product successfully created !", product });
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error });
      }
    });
  }
);

productRouter.patch(
  "/:id",
  ParamsIdValidator,
  ProductUpdateValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      const { name, price } = req.body;

      try {
        const dbUser = await prisma.product.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!dbUser) {
          throw new Error("Invalid id");
        }

        const updatedProduct = await prisma.product.update({
          where: {
            id: dbUser.id,
          },
          data: {
            name,
            price,
          },
        });

        return res.status(200).json(updatedProduct);
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

productRouter.delete(
  "/:id",
  ParamsIdValidator,
  async function (req: Request, res: Response) {
    const id = req.params.id;

    return useValidator(req, res, async () => {
      try {
        const product = await prisma.product.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        if (!product) {
          throw new Error("Invalid id");
        }

        await prisma.product.delete({
          where: {
            id: product.id,
          },
        });

        return res
          .status(200)
          .json({ message: "Product successfully deleted", product });
      } catch (error) {
        return res.status(421).json({ error });
      }
    });
  }
);

export default productRouter;
