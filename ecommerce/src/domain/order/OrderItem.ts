export interface OrderItemProps {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export class OrderItem {
  private constructor(
    private readonly props: OrderItemProps
  ) {}

  static create(props: OrderItemProps): OrderItem {
    if (props.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (props.unitPrice <= 0) {
      throw new Error("Unit price must be greater than zero");
    }

    return new OrderItem(props);
  }

  get productId(): string {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get total(): number {
    return this.unitPrice * this.quantity;
  }
}