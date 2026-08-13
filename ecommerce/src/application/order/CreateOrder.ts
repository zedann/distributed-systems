import { randomUUID } from "node:crypto";

import { Order } from "../../domain/order/Order";
import { OrderItem } from "../../domain/order/OrderItem";
import { OrderRepository } from "../../domain/order/OrderRepository";
import { ProductRepository } from "../../domain/product/ProductRepository";

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  customerId: string;
  items: CreateOrderItemInput[];
}

export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const orderItems: OrderItem[] = [];

    for (const item of input.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      product.decreaseStock(item.quantity);

      orderItems.push(
        OrderItem.create({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
        }),
      );

      await this.productRepository.save(product);
    }

    const order = Order.create({
      id: randomUUID(),
      customerId: input.customerId,
      items: orderItems,
    });

    await this.orderRepository.save(order);

    return order;
  }
}
