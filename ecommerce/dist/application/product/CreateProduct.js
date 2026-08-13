"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = void 0;
const node_crypto_1 = require("node:crypto");
const Product_1 = require("../../domain/product/Product");
class CreateProduct {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const product = Product_1.Product.create({
            id: (0, node_crypto_1.randomUUID)(),
            name: input.name,
            price: input.price,
            stock: input.stock
        });
        await this.productRepository.save(product);
        return product;
    }
}
exports.CreateProduct = CreateProduct;
