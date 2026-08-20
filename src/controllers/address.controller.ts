import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createAddressSchema } from "../validators/address.validator";
import {
  createAddressService,
  getUserAddressesService,
  deleteUserAddress
} from "../services/address.service";

export const createAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const data = createAddressSchema.parse(req.body);
    const address = await createAddressService(userId, data);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Address created successfully",
      address,
    });
  }
);

export const getUserAddressesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const result = await getUserAddressesService(userId);

    res.status(HTTPSTATUS.OK).json({
      message: "Addresses retrieved successfully",
      ...result,
    });
  }
);



export const deleteAddressController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id.toString();
    const { id } = req.params;

    await deleteUserAddress(userId, id);

    return res.status(HTTPSTATUS.OK).json({
      message: "Address deleted successfully",
    });
  }
);