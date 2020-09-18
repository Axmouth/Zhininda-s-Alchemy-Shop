import { ShoppingCartItem } from './shopping-cart-item';
export class ShoppingCart {
  shoppingCart: {
    shoppingCartId: string;
    shoppingCartItems: ShoppingCartItem[];
  };
  shoppingCartTotal: number;
}
