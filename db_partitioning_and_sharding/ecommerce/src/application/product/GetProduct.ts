import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

export class GetProduct {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  }
}
