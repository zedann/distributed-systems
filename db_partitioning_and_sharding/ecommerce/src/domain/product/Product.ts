export interface ProductProps {
  id: string;
  name: string;
  price: number;
  stock: number;
}
export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: ProductProps): Product {
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

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }
  public get price(): number {
    return this.props.price;
  }

  public get stock(): number {
    return this.props.stock;
  }

  public decreaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");

    if (quantity > this.props.stock) throw new Error("Insufficient stock");

    this.props.stock -= quantity;
  }
}
