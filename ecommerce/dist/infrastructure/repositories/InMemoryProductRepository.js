"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductRepository = void 0;
class InMemoryProductRepository {
    products = new Map();
    async save(product) {
        this.products.set(product.id, product);
    }
    async findById(id) {
        return this.products.get(id) ?? null;
    }
    async findAll() {
        return Array.from(this.products.values());
    }
}
exports.InMemoryProductRepository = InMemoryProductRepository;
