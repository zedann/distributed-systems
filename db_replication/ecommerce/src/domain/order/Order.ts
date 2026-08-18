import { OrderItem } from "./OrderItem";

export interface OrderProps {
  id: string;
  customerId: string;
  items: OrderItem[];
}

export class Order {
  private constructor(
    private readonly props: OrderProps
  ) {}

  static create(props: OrderProps): Order {
    if (props.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    return new Order(props);
  }

  get id(): string {
    return this.props.id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): OrderItem[] {
    return [...this.props.items];
  }

  get total(): number {
    return this.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }
}