import { Product } from "../../domain/product/Product";
import { ProductRepository } from "../../domain/product/ProductRepository";

export class GetProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
