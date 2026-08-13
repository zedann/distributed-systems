"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (!props.name.trim()) {
            throw new Error("Product name is required");
        }
        if (props.price <= 0) {
            throw new Error("Product price must be greater than zero");
        }
        if (props.stock < 0) {
            throw new Error("Product stock cannot be negative");
        }
        return new Product(props);
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get price() {
        return this.props.price;
    }
    get stock() {
        return this.props.stock;
    }
    decreaseStock(quantity) {
        if (quantity <= 0)
            throw new Error("Quantity must be greater than zero");
        if (quantity > this.props.stock)
            throw new Error("Insufficient stock");
        this.props.stock -= quantity;
    }
}
exports.Product = Product;
