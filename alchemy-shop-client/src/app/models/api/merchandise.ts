import { Category } from './category';
export class Merchandise {
  merchandiseId: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  imageUrl: string;
  imageThumbnailUrl: string;
  isPreferredMerchandise: boolean;
  inStock: boolean;
  inStockAmount: number;
  categoryId: number;
  category: Category;
}
