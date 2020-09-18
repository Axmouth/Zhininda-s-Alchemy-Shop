import { Merchandise } from './merchandise';

export class ShoppingCartItem {
  shoppingCartItemId: number;
  merchandise: Merchandise;
  amount: number;
  shoppingCartId: number;
}
