import { Request, Response } from "express";

import { createOrder } from "../../../container";

export class OrderController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const order = await createOrder.execute({
        customerId: req.body.customerId,
        items: req.body.items,
      });

      res.status(201).json({
        id: order.id,
        customerId: order.customerId,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.total,
        })),
        total: order.total,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
