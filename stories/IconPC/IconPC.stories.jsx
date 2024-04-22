import { IconPC } from './IconPC';

export default {
  title: 'Элементы / Иконки',
  component: IconPC,
  tags: ['autodocs'],
  argTypes: {
    count: {
      type: 'string',
      description: 'Сумма товара в корзине',
    },
    icon: {
      type: 'string',
      description: 'Тип иконки',
      // control: {
      //   type: 'radio',
      // },
      // options: ['location', 'profile', 'docs', 'basket', 'ya', 'eyeShow', 'eyeHide', 'clear', 'check']
    },
    element: {
      type: 'string',
      description: 'Элемент где используется иконка',
    },
    foodValue: {
      type: 'boolean',
      description: 'Тип модального окна: БЖУ или нет',
    },
  },
};

const Template = (args) => <IconPC {...args} />;
export const Location = Template.bind({});
export const Profile = Template.bind({});
export const Docs = Template.bind({});
export const Basket = Template.bind({});
export const BasketActive = Template.bind({});
export const BasketActiveLong = Template.bind({});
export const Yandex = Template.bind({});
export const EyeShow = Template.bind({});
export const EyeHide = Template.bind({});
export const Clear = Template.bind({});
export const Check = Template.bind({});
export const Vector_Rigth = Template.bind({});
export const Done = Template.bind({});
export const Value = Template.bind({});
export const Value_Active = Template.bind({});

Location.args = {
  count: 0,
  icon: 'location',
  element: 'header',
};

Profile.args = {
  count: 0,
  icon: 'profile',
  element: 'header',
};

Docs.args = {
  count: 0,
  icon: 'docs',
  element: 'header',
};

Basket.args = {
  count: 0,
  icon: 'basket',
  element: 'header',
};

BasketActive.args = {
  count: 245,
  icon: 'basket',
  element: 'header',
};

BasketActiveLong.args = {
  count: 10666,
  icon: 'basket',
  element: 'header',
};

Yandex.args = {
  icon: 'ya',
  element: 'auth',
};

EyeShow.args = {
  icon: 'eyeShow',
  element: 'auth',
};

EyeHide.args = {
  icon: 'eyeHide',
  element: 'auth',
};

Clear.args = {
  icon: 'clear',
  element: 'auth',
};

Check.args = {
  icon: 'check',
  element: 'auth',
};

Vector_Rigth.args = {
  icon: 'vector_rigth',
  element: 'auth',
};

Done.args = {
  icon: 'done',
  element: 'auth',
};

Value.args = {
  icon: 'value',
  element: 'product',
  foodValue: false
}

Value_Active.args = {
  icon: 'value',
  element: 'product',
  foodValue: true
};
