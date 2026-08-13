"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
class OrderItem {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (props.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
        if (props.unitPrice <= 0) {
            throw new Error("Unit price must be greater than zero");
        }
        return new OrderItem(props);
    }
    get productId() {
        return this.props.productId;
    }
    get productName() {
        return this.props.productName;
    }
    get unitPrice() {
        return this.props.unitPrice;
    }
    get quantity() {
        return this.props.quantity;
    }
    get total() {
        return this.unitPrice * this.quantity;
    }
}
exports.OrderItem = OrderItem;
