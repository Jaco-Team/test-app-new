import React from 'react';

import { MyMenu } from './MyMenu';

export default {
  title: 'Header / Меню',
  component: MyMenu,
  tags: ['autodocs'],
  argTypes: {
    
  }
};

//👇 Мы создаем шаблон того, как аргументы соотносятся с отображением (рендерингом) в Storybook.
const Template = (args) => <MyMenu {...args} />;

//👇 Затем каждая история повторно использует этот шаблон.
export const Default = Template.bind({});

Default.args = {
  list: [{link: 'https://example.com', title: 'Сеты'}, {link: 'https://example.com', title: 'Фирменные роллы'}, {link: 'https://example.com', title: 'Жаренные роллы'}, {link: 'https://example.com', title: 'Запеченные роллы'}],
  onClose: () => {},
  isOpen: true,
  anchorEl: null,
  type: 'cat'
};
