import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";

export interface RequestWithObjectId extends Request {
  objectId?: ObjectId;
}

/**
 * Validates an ObjectID from the request parameters
 * @param req - Express request object
 * @param res - Express response object
 * @returns - Valid ObjectId or error response
 */

export function validateObjectIdMiddleware(
  req: RequestWithObjectId,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ObjectId format" });
  }

  req.objectId = new ObjectId(id);
  next();
}