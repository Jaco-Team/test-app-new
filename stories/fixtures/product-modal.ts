const modalItemDescVariant1 = {
  title_desk: 'Атлантида сет',
  cat_id: '4',
  typeModal: 'start',
  count_part_new: '4 ролла',
  size_pizza: '35',
  count_part: '32',
  weight: '1129',
  id: '4',
  foodValue: false,
  marc_desc:
    'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Акваланг запечённый унаги, Калифорния с лососем Люкс',
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
    'Остренькие колбаски пепперони, сыр моцарелла с нежным сливочным вкусом, томатный соус с базиликом',
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
  children: '500',
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

const modalSetItemDefault = {
  number: 1,
  title: 'Гавайи жареный',
  img_app: 'Gavaii_zharenyi20220726',
  marc_desc:
    'Белое куриное филе, солнечный медовый ананас, лёгкий творожный сыр, белый соус, обжаренные сухарики',
  tmp_desc: '',
};

const modalValueDefault = {
  number: 1,
  title: 'Гавайи жареный',
  kkal: '173',
  tmp_desc:
    'Состав: куриное филе, ананас, творожный сыр, панировочные сухари, соус белый',
  protein: '4,9',
  fat: '8,9',
  carbohydrates: '18,6',
};

export const modalItemListSetArgs = {
  value: {},
  set: modalSetItemDefault,
  type: 'set',
  link_allergens: '',
};

export const modalItemListValueArgs = {
  value: modalValueDefault,
  set: {},
  type: 'value',
  link_allergens:
    'https://storage.yandexcloud.net/site-other-data/jaco_2024_03_23.pdf',
};

export const modalItemStart1Args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
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
  count: modalButtonArgs,
  list: {},
  typeModal: 'start',
};

export const modalItemStart3Args = {
  title: 'Frustyle Апельсин',
  img_name: 'Frustyle_Apelsin',
  is_new: '0',
  is_hit: '0',
  desc: modalItemDescVariant3,
  count: modalButtonArgs,
  list: {},
  typeModal: 'start',
};

export const modalItemSetArgs = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
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
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
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
