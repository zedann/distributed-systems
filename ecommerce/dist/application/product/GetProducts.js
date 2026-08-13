"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProducts = void 0;
class GetProducts {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        return this.productRepository.findAll();
    }
}
exports.GetProducts = GetProducts;
