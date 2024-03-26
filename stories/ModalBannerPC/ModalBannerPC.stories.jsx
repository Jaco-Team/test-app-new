import { ModalBannerPC } from './ModalBannerPC';

export default {
  title: 'ModalBannerPC',
  component: ModalBannerPC,
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

const Template = (args) => <ModalBannerPC {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'НОВОЕ КОМБО: пицца Пепперони + сет Атлантида!',
  img: 'Kombo1_Tlt',
  text: '<p><strong>КОМБО: пицца Пепперони + сет Атлантида!</strong><br>Получите большой набор вкусных блюд всего за <strong>1365 ₽</strong>:<br>- пицца Пепперони<br>- ролл Филадельфия Лайт<br>- ролл Калифорния с лососем Люкс<br>- ролл Акваланг запечённый унаги<br>- ролл Цезарь с курицей запечённый унаги</p>\n<p>Чтобы воспользоваться предложением:<br>Введите промокод <strong>МАМБО</strong> в специальном поле для промокода. Товары автоматически добавятся в корзину.<br>Откройте для себя многообразие вкусовых сочетаний!<br>Пусть каждый найдёт блюдо по душе!</p>\n<p><strong>Акция действует ежедневно</strong> до 29.02.2024 г. на доставку, самовывоз и заказы в кафе. Возможны изменения или приостановление акции. Один промокод можно применить неограниченное количество раз. Промокод не суммируется с другими акциями.</p>',
  typePromo: '1',
  count: 0,
};
