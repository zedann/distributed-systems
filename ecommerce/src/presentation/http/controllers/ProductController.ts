import { Request, Response } from "express";

import {
  createProduct,
  getProducts
} from "../../../container";

export class ProductController {
  static async create(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const product = await createProduct.execute({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
      });

      res.status(201).json({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock
      });
    } catch (error) {
      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unknown error"
      });
    }
  }

  static async getAll(
    _req: Request,
    res: Response
  ): Promise<void> {
    const products = await getProducts.execute();

    res.json(products);
  }
}