"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const container_1 = require("../../../container");
class ProductController {
    static async create(req, res) {
        try {
            const product = await container_1.createProduct.execute({
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock
            });
            res.status(201).json({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock
            });
        }
        catch (error) {
            res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Unknown error"
            });
        }
    }
    static async getAll(_req, res) {
        const products = await container_1.getProducts.execute();
        res.json(products);
    }
}
exports.ProductController = ProductController;
