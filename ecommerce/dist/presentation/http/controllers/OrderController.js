"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const container_1 = require("../../../container");
class OrderController {
    static async create(req, res) {
        try {
            const order = await container_1.createOrder.execute({
                customerId: req.body.customerId,
                items: req.body.items,
            });
            res.status(201).json({
                id: order.id,
                customerId: order.customerId,
                items: order.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    total: item.total,
                })),
                total: order.total,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.OrderController = OrderController;
