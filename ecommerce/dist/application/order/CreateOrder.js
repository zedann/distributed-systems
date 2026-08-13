"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = void 0;
const node_crypto_1 = require("node:crypto");
const Order_1 = require("../../domain/order/Order");
const OrderItem_1 = require("../../domain/order/OrderItem");
class CreateOrder {
    orderRepository;
    productRepository;
    constructor(orderRepository, productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    async execute(input) {
        const orderItems = [];
        for (const item of input.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            product.decreaseStock(item.quantity);
            orderItems.push(OrderItem_1.OrderItem.create({
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
            }));
            await this.productRepository.save(product);
        }
        const order = Order_1.Order.create({
            id: (0, node_crypto_1.randomUUID)(),
            customerId: input.customerId,
            items: orderItems,
        });
        await this.orderRepository.save(order);
        return order;
    }
}
exports.CreateOrder = CreateOrder;
