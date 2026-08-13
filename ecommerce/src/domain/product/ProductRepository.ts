import { Product } from "./Product";

export interface ProductRepository {
  save(product: Product): Promise<void>;

  findById(id: string): Promise<Product | null>;

  findAll(): Promise<Product[]>;
}
