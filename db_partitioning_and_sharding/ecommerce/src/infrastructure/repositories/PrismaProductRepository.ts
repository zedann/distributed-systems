import { primaryPrisma, readPrisma } from "../database/prisma";

import {
  ProductRepository,
  ReadConsistency,
} from "../../domain/product/ProductRepository";

import { Product } from "../../domain/product/Product";

export class PrismaProductRepository implements ProductRepository {
  async save(product: Product): Promise<void> {
    await primaryPrisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
    });
  }

  async findById(
    id: string,
    options?: {
      consistency?: ReadConsistency;
    },
  ): Promise<Product | null> {
    const consistency = options?.consistency ?? "eventual";

    const db = consistency === "strong" ? primaryPrisma : readPrisma;

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return Product.create({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await readPrisma.product.findMany();

    return products.map((product: any) =>
      Product.create({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
      }),
    );
  }
}
