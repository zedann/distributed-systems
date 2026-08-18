import { Product } from "./Product";
export type ReadConsistency = "strong" | "eventual";

export interface ProductRepository {
  save(product: Product): Promise<void>;

  findById(id: string): Promise<Product | null>;

  findAll(): Promise<Product[]>;
}
