"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (props.items.length === 0) {
            throw new Error("Order must contain at least one item");
        }
        return new Order(props);
    }
    get id() {
        return this.props.id;
    }
    get customerId() {
        return this.props.customerId;
    }
    get items() {
        return [...this.props.items];
    }
    get total() {
        return this.items.reduce((sum, item) => sum + item.total, 0);
    }
}
exports.Order = Order;
