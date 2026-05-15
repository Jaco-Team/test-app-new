const modalItemDescVariant1 = {
  title_desk: 'Морской сет',
  cat_id: '4',
  typeModal: 'start',
  count_part_new: '4 ролла',
  size_pizza: '35',
  count_part: '32',
  weight: '1122',
  id: '4',
  foodValue: false,
  marc_desc:
    'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
  tmp_desc: '',
};

const modalItemDescVariant2 = {
  title_desk: 'Пепперони',
  cat_id: '14',
  typeModal: 'start',
  count_part_new: '',
  size_pizza: '35',
  count_part: '32',
  weight: '640',
  id: '4',
  foodValue: false,
  marc_desc:
    'Пикантная колбаса пепперони, сыр моцарелла с нежным сливочным вкусом, натуральный томатный соус',
  tmp_desc: '',
};

const modalItemDescVariant3 = {
  title_desk: 'Frustyle Апельсин',
  cat_id: '6',
  typeModal: 'start',
  count_part_new: '',
  size_pizza: '35',
  count_part: '1',
  weight: '0.5',
  id: '4',
  foodValue: false,
  marc_desc:
    'Газированный напиток с бодрящим цитрусовым вкусом прекрасно дополнит любое блюдо',
  tmp_desc: '',
};

const modalButtonArgs = {
  variant: 'modal',
  children: '1489',
  count: 0,
  typeModal: 'start',
  element: 'modal',
};

const modalButtonActiveArgs = {
  variant: 'modal',
  children: '',
  count: 1,
  typeModal: 'start',
  element: 'modal',
};

export const morskoiSetItems = [
  {
    id: 1,
    title: 'Жако Люкс',
    img_app: 'Roll_ZHako_Liuks',
    marc_desc:
      'Премиальный слабосолёный лосось, хрустящий огурчик, россыпь кунжутных зёрен, творожный сыр с соусом унаги',
    tmp_desc: '',
    kkal: '207',
    protein: '7,4',
    fat: '9,8',
    carbohydrates: '22,1',
  },
  {
    id: 2,
    title: 'Филадельфия Лайт',
    img_app: 'Filadelfiia_Lait',
    marc_desc:
      'Нежное сочетание тающего во рту слабосолёного лосося и творожного сыра с приятным сливочным послевкусием',
    tmp_desc: '',
    kkal: '175',
    protein: '5,9',
    fat: '9,6',
    carbohydrates: '16,3',
  },
  {
    id: 3,
    title: 'Цезарь с лососем запечённый унаги',
    img_app: 'Cezar_s_lososem_zapechionnyi_unagi',
    marc_desc:
      'Премиумный лосось, салат айсберг, творожный сыр, тёртый пармезан, белый соус, унаги и кунжут',
    tmp_desc: '',
    kkal: '219',
    protein: '7,6',
    fat: '11,2',
    carbohydrates: '22,4',
  },
  {
    id: 4,
    title: 'Калифорния с креветкой запечённый унаги',
    img_app: 'Kaliforniia_s_krevetkoi_zapechionnyi_unagi',
    marc_desc:
      'Отборная креветка, свежий хрустящий огурец, копчёная икра масаго, творожный сыр, унаги и кунжут',
    tmp_desc: '',
    kkal: '201',
    protein: '6,8',
    fat: '8,7',
    carbohydrates: '23,6',
  },
];

const modalSetItemDefault = morskoiSetItems[0];
const modalValueDefault = {
  ...morskoiSetItems[0],
  tmp_desc: morskoiSetItems[0].marc_desc,
};

export const modalItemListSetArgs = {
  value: [],
  set: morskoiSetItems,
  type: 'set',
  link_allergens: '',
};

export const modalItemListValueArgs = {
  value: morskoiSetItems.map((item) => ({ ...item, tmp_desc: item.marc_desc })),
  set: [],
  type: 'value',
  link_allergens:
    'https://storage.yandexcloud.net/site-other-data/jaco_2026_05_15.pdf',
};

export const modalItemStart1Args = {
  title: 'Морской сет',
  img_name: 'Morskoi_set',
  is_new: '0',
  is_hit: '0',
  desc: modalItemDescVariant1,
  count: modalButtonArgs,
  list: {},
  typeModal: 'start',
};

export const modalItemStart2Args = {
  title: 'Пепперони',
  img_name: 'Pepperoni',
  is_new: '0',
  is_hit: '0',
  desc: modalItemDescVariant2,
  count: { ...modalButtonArgs, children: '659' },
  list: {},
  typeModal: 'start',
};

export const modalItemStart3Args = {
  title: 'Frustyle Апельсин',
  img_name: 'Frustyle_Apelsin',
  is_new: '0',
  is_hit: '0',
  desc: modalItemDescVariant3,
  count: { ...modalButtonArgs, children: '129' },
  list: {},
  typeModal: 'start',
};

export const modalItemSetArgs = {
  title: 'Морской сет',
  img_name: 'Morskoi_set',
  is_new: '0',
  is_hit: '0',
  desc: { ...modalItemDescVariant1, typeModal: 'set' },
  count: { ...modalButtonArgs, typeModal: 'set' },
  list: modalItemListSetArgs,
  typeModal: 'set',
};

export const modalItemSetCountArgs = {
  ...modalItemSetArgs,
  count: { ...modalButtonActiveArgs, typeModal: 'set' },
};

export const modalItemValue1Args = {
  title: 'Морской сет',
  img_name: 'Morskoi_set',
  is_new: '0',
  is_hit: '0',
  desc: { ...modalItemDescVariant1, typeModal: 'set', foodValue: true },
  count: { ...modalButtonArgs, typeModal: 'set' },
  list: modalItemListValueArgs,
  typeModal: 'value',
};

export const modalItemValue2Args = {
  ...modalItemValue1Args,
  desc: { ...modalItemDescVariant2, typeModal: 'set', foodValue: true },
};

export const modalItemValue3Args = {
  ...modalItemValue1Args,
  desc: { ...modalItemDescVariant3, typeModal: 'set', foodValue: true },
};

export const modalItemValueCountArgs = {
  ...modalItemValue1Args,
  count: { ...modalButtonActiveArgs, typeModal: 'set' },
};

export const modalItemBadgeArgs = {
  ...modalItemStart1Args,
  is_new: '1',
};
export const morskoiProductModalRolls = morskoiSetItems.map((item) => ({
  id: item.id,
  name: item.title,
  description: item.marc_desc,
  image: `https://mainimg.jacofood.ru/${item.img_app}_292x292.webp`,
  calories: Number(item.kkal),
  ingredients: item.marc_desc,
  nutrition: {
    proteins: Number(item.protein.replace(',', '.')),
    fats: Number(item.fat.replace(',', '.')),
    carbohydrates: Number(item.carbohydrates.replace(',', '.')),
  },
}));

export const morskoiProductModalRelatedProducts = [
  {
    id: 1,
    name: 'Мадейра сет',
    description:
      'Цезарь с курицей запечённый унаги, Коралл, Коралл запечённый унаги, Алоха',
    price: 1349,
    image: 'https://mainimg.jacofood.ru/Madeira_set_292x292.webp',
    rollsCount: 4,
    piecesCount: 32,
    weight: 1115,
  },
  {
    id: 2,
    name: 'Вулкан сет',
    description:
      'Гавайи жареный, Мачете жареный, Везувий запечённый унаги, Лава запечённый унаги',
    price: 1429,
    image: 'https://mainimg.jacofood.ru/Vulkan_set_292x292.webp',
    rollsCount: 4,
    piecesCount: 32,
    weight: 1227,
  },
  {
    id: 3,
    name: 'Атлантида сет',
    description:
      'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Акваланг запечённый унаги, Калифорния с лососем Люкс',
    price: 1469,
    image: 'https://mainimg.jacofood.ru/Atlantida_set_292x292.webp',
    rollsCount: 4,
    piecesCount: 32,
    weight: 1129,
  },
  {
    id: 4,
    name: 'Морской сет',
    description:
      'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
    price: 1489,
    image: 'https://mainimg.jacofood.ru/Morskoi_set_292x292.webp',
    rollsCount: 4,
    piecesCount: 32,
    weight: 1122,
  },
];

export const morskoiProductModalArgs = {
  isOpen: true,
  onClose: () => {},
  productImage: 'https://mainimg.jacofood.ru/Morskoi_set_732x732.webp',
  productName: 'Морской сет',
  rollsCount: 4,
  piecesCount: 32,
  weight: 1122,
  productDescription:
    'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
  price: 1489,
  rollsData: morskoiProductModalRolls,
  relatedProducts: morskoiProductModalRelatedProducts,
};
