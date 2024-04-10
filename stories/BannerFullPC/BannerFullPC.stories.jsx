import { BannerFullPC } from './BannerFullPC';

export default {
  title: 'Акции / Акция',
  component: BannerFullPC,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Имя для картинки',
    },
    img: {
      type: 'string',
      description: 'Название картинки',
    },
    text: {
      type: 'string',
      description: 'Описание акции',
    },
    typePromo: {
      type: 'string',
      description: 'Тип промика',
    },
    count: {
      type: 'number',
      description: 'Количество товара',
    },
  },
};

const Template = (args) => <BannerFullPC {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
  img: "https://storage.yandexcloud.net/site-home-img/Kombo1_Tlt_3700x1000.jpg",
  text: '<p><strong>КОМБО: пицца Пепперони + сет Атлантида!</strong><br>Получите большой набор вкусных блюд всего за <strong>1365 ₽</strong>:<br>- пицца Пепперони<br>- ролл Филадельфия Лайт<br>- ролл Калифорния с лососем Люкс<br>- ролл Акваланг запечённый унаги<br>- ролл Цезарь с курицей запечённый унаги</p>\n<p>Чтобы воспользоваться предложением:<br>Введите промокод <strong>МАМБО</strong> в специальном поле для промокода. Товары автоматически добавятся в корзину.<br>Откройте для себя многообразие вкусовых сочетаний!<br>Пусть каждый найдёт блюдо по душе!</p>\n<p><strong>Акция действует ежедневно</strong> до 29.02.2024 г. на доставку, самовывоз и заказы в кафе. Возможны изменения или приостановление акции. Один промокод можно применить неограниченное количество раз. Промокод не суммируется с другими акциями.</p>',
  typePromo: 2,
  count: 0,
  items: [
    {
      title: 'Водопад сет',
      img_app: "Cezar_s_kuricei_zapechionnyi_unagi",
      desc: 'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
      price: '1129',
    },
    {
      title: 'Цезарь с курицей запечённый унаги',
      img_app: "Cezar_s_kuricei_zapechionnyi_unagi",
      desc: 'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом',
      price: '229',
    },
  ]
};
