import { Merchandise } from './merchandise';
import { Order } from './order';

export class OrderDetail {
  orderDetailId: number;
  orderId: number;
  merchandiseId: number;
  amount: number;
  value: number;
  merchandise?: Merchandise;
  order?: Order;
}
