import { Category } from './category';
import { Effect } from './effect';
export class Merchandise {
  merchandiseId: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  value: number;
  imageUrl: string;
  imageThumbnailUrl: string;
  isPreferredMerchandise: boolean;
  amountInStock: number;
  categoryId: number;
  category: Category;
  primaryEffect: Effect;
  secondaryEffect: Effect;
  tertiaryEffect: Effect;
  quaternaryEffect: Effect;
}
