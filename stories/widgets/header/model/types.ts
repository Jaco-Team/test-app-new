export interface SubCatItem {
  id: string;
  name: string;
  link: string;
}

export interface CatItem {
  id: string;
  name: string;
  cats: SubCatItem[];
}

export interface NavBarMenuProps {
  activePage?:
    | 'home'
    | 'contacts'
    | 'other'
    | 'account'
    | 'profile'
    | 'address'
    | 'promokody'
    | 'zakazy'
    | 'cart';
  itemsCount?: number;
  isAuth?: 'auth' | 'guest' | 'pending';
}

export interface HeaderProps {
  /** Тип отображения шапки */
  viewport?: 'mobile' | 'tablet' | 'desktop';
  /** Активация тени при скролле страницы */
  scroll?: boolean;
  /** Сумма товаров в корзине */
  count?: string;
  /** Активация мобильного меню (для mobile и tablet) */
  activeMenu?: boolean;
  /** Настройки мобильного меню */
  menu?: NavBarMobileProps;
  /** Колбек при клике на бургер меню */
  onMenuToggle?: (state: boolean) => void;
}
