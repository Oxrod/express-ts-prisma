import { param } from "express-validator";

export const ParamsIdValidator = [param("id").notEmpty().isNumeric()];
