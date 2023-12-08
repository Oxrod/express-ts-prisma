import { Request, Response } from "express";
import { validationResult } from "express-validator";

export default async function useValidator(
  req: Request,
  res: Response,
  callback: () => void
) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return callback();
  } else {
    return res.send({ errors: errors.array() });
  }
}
