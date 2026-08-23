import { Request, Response } from "express";
import Customer from "../models/user.model"; // adjust path to match your project
import Order from "../models/order.model";

// GET /admin/customers?status=banned&search=john&page=1&limit=20
export const getCustomersController = async (req: Request, res: Response) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const customers = await Customer.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Customer.countDocuments(filter);

  res.json({
    customers,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

// GET /admin/customers/:id
export const getCustomerByIdController = async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id).select("-password");
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const orders = await Order.find({ customer: customer._id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ customer, orders });
};

// PATCH /admin/customers/:id
export const updateCustomerController = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body; // whitelist — never accept password/status here

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, email, phone },
    { new: true, runValidators: true }
  ).select("-password");

  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
};

// PATCH /admin/customers/:id/status
export const updateCustomerStatusController = async (req: Request, res: Response) => {
  const { status, reason } = req.body; // status: "active" | "suspended" | "banned"

  if (!["active", "suspended", "banned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { status, statusReason: reason ?? null, statusUpdatedAt: new Date() },
    { new: true }
  ).select("-password");

  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
};