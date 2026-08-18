import { randomUUID } from "node:crypto";

import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export class CreateProduct {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    input: CreateProductInput
  ): Promise<Product> {
    const product = Product.create({
      id: randomUUID(),
      name: input.name,
      price: input.price,
      stock: input.stock
    });

    await this.productRepository.save(product);

    return product;
  }
}