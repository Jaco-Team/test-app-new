import { PromoModal } from './PromoModal';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

export default {
  title: 'Promo / Promo Modal',
  component: PromoModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

const Template = (args) => <PromoModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => console.log('Close modal'),
  title: 'Влюбиться по-новому',
  subtitle: 'Филадельфия опалённая с молодым шпинатом',
  badgeText: 'НОВИНКА',
  price: 529,
  bannerImage: '/images/sushi-banner.jpg',
  productImage: '/images/sushi-product.jpg',
  productName: 'Филадельфия опалённая',
  productDescription:
    'Опалённый лосось, сливочный творожный сыр и молодой шпинат под сладким соусом унаги с ароматным чёрным кунжутом',
  marketingTitle:
    'Филадельфия опалённая — весенняя новинка, разжигающая чувства!',
  marketingDescription: `
    <p>Позвольте себе влюбиться заново!</p>
    <p>Премиальный лосось обжигается пламенем до лёгкого аромата гриля и идеально раскрывается в сочетании с мягким сливочным вкусом творожного сыра. Сочный молодой шпинат добавляет композиции весенней свежести, а соус унаги и чёрный кунжут — приятное послевкусие 🔥</p>
    <p>Филадельфия опалённая — любовь с первого кусочка! ❤️</p>
  `,
  endDate: '31.05.2026',
  relatedProducts: [
    {
      id: 1,
      name: 'Цезарь с курицей запечённый унаги, Коралл, Коралл запечённый унаги, Алоха',
      description: '',
      price: 1115,
      image: '/images/related-1.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1115,
    },
    {
      id: 2,
      name: 'Гаваи жареный, Мачете жареный, Везувий запечённый унаги, Лава запечённый унаги',
      description: '',
      price: 1227,
      image: '/images/related-2.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1227,
    },
    {
      id: 3,
      name: 'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Акваванг запечённый унаги, Калифорния с лососем Люкс',
      description: '',
      price: 1129,
      image: '/images/related-3.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1129,
    },
    {
      id: 4,
      name: 'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
      description: '',
      price: 1122,
      image: '/images/related-4.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1122,
    },
  ],
};

export const Closed = Template.bind({});
Closed.args = {
  ...Default.args,
  isOpen: false,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
