import { OrderDetail } from './order-detail';
export class Order {
  orderId: number;
  orderLines: OrderDetail[];
  orderTotal: number;
  orderPlaced: string;
  userId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  zipCode: string;
  state: string;
}
