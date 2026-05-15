export interface CheckPromoResult {
  st: boolean;
  message?: string;
  discount?: number;
  [key: string]: any;
}

// Интерфейс для товара в корзине
export interface CartItem {
  id?: string | number;
  name?: string;
  price?: number;
  isPromo?: boolean;
  [key: string]: any;
}

// Интерфейс для пропсов компонента
export interface CartPromoInputProps {
  promo?: string;
  checkPromo?: CheckPromoResult | null;
  items_on_price?: CartItem[];
  status_promo?: boolean;
  itemsCount?: number;
  allPrice?: number | string;
  promoItemsFind?: boolean;
}
