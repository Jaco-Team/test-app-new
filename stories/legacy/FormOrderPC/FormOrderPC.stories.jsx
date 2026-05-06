import { FormOrderPC } from './FormOrderPC';
import * as MyMenu from '../MyMenu/MyMenu.stories';
import * as FormOrderPC_btn from '../FormOrderPC_btn/FormOrderPC_btn.stories';

export default {
  title: 'Cart / ПК / Модалка оформления заказа',
  component: FormOrderPC,
  tags: ['autodocs'],
  argTypes: {
    typeOrder: {
      type: 'string',
      description: 'Тип заказа',
    },
    summ: {
      type: 'string',
      description: 'Сумма доставки',
    },
    itemsCount: {
      type: 'string',
      description: 'Количестов позиций товаров',
    },
    allPrice: {
      type: 'string',
      description: 'Сумма заказа',
    },
    hours: {
      type: 'string',
      description: 'Время заказа',
    },
    address: {
      type: 'string',
      description: 'Адрес клиента или точки',
    },
    list: {
      type: 'object',
      description: 'Список для выбора',
    },
    list_address: {
      type: 'object',
      description: 'Список адресов для выбора',
    },
    online: {
      type: 'string',
      description: 'Оплата онлайн',
    },
    comment: {
      type: 'string',
      description: 'Сообщение курьеру',
    },
  },
};

const Template = (args) => <FormOrderPC {...args} />;
export const Delivery = Template.bind({});
export const Delivery_Active = Template.bind({});
export const Delivery_Active_Sdacha = Template.bind({});
export const Pikcup = Template.bind({});
export const Pikcup_Active = Template.bind({});

Delivery.args = {
  typeOrder: 'delivery',
  summ: '0',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  list: MyMenu.Form_Order_Basic.args.list,
  list_address: MyMenu.Form_Order_Address.args.list,
  address: '',
  online: '',
  comment: ''
};

Delivery_Active.args = {
  typeOrder: 'delivery',
  summ: '149',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  online: 'Картой на сайте',
  comment: FormOrderPC_btn.Message_Active.args.text,
  address: FormOrderPC_btn.Long_text.args.text,
  list: MyMenu.Form_Order_Basic.args.list,
  list_address: MyMenu.Form_Order_Address.args.list,
};

Delivery_Active_Sdacha.args = {
  typeOrder: 'delivery',
  summ: '149',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  online: 'Наличными курьеру',
  comment: FormOrderPC_btn.Message_Active.args.text,
  address: FormOrderPC_btn.Long_text.args.text,
  list: MyMenu.Form_Order_Basic.args.list,
  list_address: MyMenu.Form_Order_Address.args.list,
};

Pikcup.args = {
  typeOrder: 'pickup',
  summ: '0',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  list: MyMenu.Form_Order_Basic.args.list,
  list_address: [],
  address: '',
  online: '',
  comment: ''
};

Pikcup_Active.args = {
  typeOrder: 'pickup',
  summ: '0',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  list: MyMenu.Form_Order_Basic.args.list,
  list_address: [],
  address: 'Ленинградская, 47',
  online: '',
  comment: ''
};
