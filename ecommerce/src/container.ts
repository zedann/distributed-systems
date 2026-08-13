import { CreateProduct } from "./application/product/CreateProduct";
import { GetProducts } from "./application/product/GetProducts";
import { CreateOrder } from "./application/order/CreateOrder";

import { InMemoryProductRepository } from "./infrastructure/repositories/InMemoryProductRepository";
import { InMemoryOrderRepository } from "./infrastructure/repositories/InMemoryOrderRepository";

const productRepository =
  new InMemoryProductRepository();

const orderRepository =
  new InMemoryOrderRepository();

export const createProduct =
  new CreateProduct(productRepository);

export const getProducts =
  new GetProducts(productRepository);

export const createOrder =
  new CreateOrder(
    orderRepository,
    productRepository
  );