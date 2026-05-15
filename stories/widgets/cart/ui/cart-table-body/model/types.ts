import { TableCartFootProps } from '@stories/widgets/cart/ui/cart-table-footer/model/types';

export interface CartItem {
  id?: string | number;
  title?: string;
  img_app?: string;
  status_promo?: boolean;
  new_one_price?: string | number;
  all_price?: string | number;
  one_price?: string | number;
  count?: string | number;
  disabled?: boolean;
  [key: string]: any;
}

// Интерфейс для пропсов компонента TableCart_body
export interface TableCartBodyProps {
  items?: CartItem[];
  itemsCount?: number;
  dopItems?: CartItem[];
  dopItemsCount?: number;
  footerData?: TableCartFootProps;
}
