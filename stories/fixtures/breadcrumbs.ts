export type BreadcrumbItem = {
  link?: string;
  text: string;
};

export type BreadcrumbsData = {
  activePage: string;
  title: string;
  list: BreadcrumbItem[];
};

const docsList: BreadcrumbItem[] = [
  { link: 'publichnaya-oferta', text: 'Публичная оферта' },
  { link: 'company-details', text: 'Реквизиты' },
  { link: 'politika-konfidencialnosti', text: 'Политика конфиденциальности' },
  { link: 'instpayorders', text: 'Правила оплаты' },
  { link: 'legal', text: 'Согласие на обработку персональных данных' },
  { link: '', text: 'Калорийность, состав, БЖУ' },
];

const profileList: BreadcrumbItem[] = [
  { link: 'zakazy', text: 'История заказов' },
  { link: 'profile', text: 'Личные данные' },
  { link: 'promokody', text: 'Мои промокоды' },
];

const aboutList: BreadcrumbItem[] = [
  { text: 'Превосходные блюда' },
  { text: 'Доступные цены' },
  { text: 'Как выглядит кафе' },
  { text: 'Время приготовления заказа' },
  { text: 'Заряжаем оптимизмом!' },
  { text: 'Социальная и экологическая ответственность' },
  { text: 'Обратная связь' },
  { text: 'Сотрудничество' },
];

export const breadcrumbsDocs: BreadcrumbsData = {
  activePage: ' ',
  title: 'Документы',
  list: docsList,
};

export const breadcrumbsAbout: BreadcrumbsData = {
  activePage: 'about',
  title: 'О Компании',
  list: aboutList,
};

export const breadcrumbsProfile: BreadcrumbsData = {
  activePage: '',
  title: 'Личный кабинет',
  list: profileList,
};
