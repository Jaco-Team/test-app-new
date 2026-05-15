export interface TableCartFootProps {
  itemsCount?: number;
  items_on_price?: any[]; // Можно заменить на более конкретный тип, если известна структура товаров
  promoItemsFind?: boolean;
  status_promo?: boolean;
  itemsOffDops?: any[]; // Можно заменить на более конкретный тип, если известна структура
  price1?: string | number;
  price2?: string | number;
}

// Тип для склонения слов
export type WordVariants = ['позиция', 'позиции', 'позиций'];
