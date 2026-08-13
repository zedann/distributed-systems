"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryOrderRepository = void 0;
class InMemoryOrderRepository {
    orders = new Map();
    async save(order) {
        this.orders.set(order.id, order);
    }
    async findById(id) {
        return this.orders.get(id) ?? null;
    }
}
exports.InMemoryOrderRepository = InMemoryOrderRepository;
