export interface RelatedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rollsCount: number;
  piecesCount: number;
  weight: number;
}

export interface RollItem {
  id: number;
  name: string;
  description: string;
  image: string;
  calories?: number;
  ingredients?: string;
  nutrition?: {
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
  productName?: string;
  rollsCount?: number;
  piecesCount?: number;
  weight?: number;
  productDescription?: string;
  price?: number;
  relatedProducts?: RelatedProduct[];
  rollsData: RollItem[];
}
