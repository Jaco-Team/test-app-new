export const productImages = {
  madeiraSet: new URL('./assets/product-madeira-set.webp', import.meta.url)
    .href,
};

export const productCardFixtures = {
  madeiraSet: {
    title: 'Мадейра сет',
    image: productImages.madeiraSet,
    meta: ['4 ролла', '32 шт.', '1 115 г'],
    description:
      'Цезарь с курицей запечённый унаги, Коралл, Коралл запечённый унаги, Алоха',
    price: 1349,
    badges: [{ tone: 'new' as const, label: 'НОВИНКА' }],
  },
};
