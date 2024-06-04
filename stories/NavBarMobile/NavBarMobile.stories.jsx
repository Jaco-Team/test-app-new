import { NavBarMobile } from './NavBarMobile';

export default {
  title: 'Header / Мобильное устройство / Меню',
  component: NavBarMobile,
  tags: ['autodocs'],
  argTypes: {
    activePage: {
      type: 'string',
      description: 'Активная страница',
    },
    itemsCount: {
      type: 'number',
      description: 'Общее количество позиций товара в корзине',
    },
    isAuth: {
      type: 'string',
      description: 'Авторизован или нет пользователь',
    },
  },
};

const Template = (args) => <NavBarMobile {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  activePage: 'home',
  itemsCount: 0,
  isAuth: 'auth',
};

Active.args = {
  activePage: 'cart',
  itemsCount: 5,
  isAuth: 'none',
};
