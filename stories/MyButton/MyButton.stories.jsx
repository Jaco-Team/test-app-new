import React from 'react';

import { MyButton } from './MyButton';

export default {
  title: 'Кнопка',
  component: MyButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      type: 'string',
      description: 'Вариант заливки кнопки',
      defaultValue: 'primary',
      control: {
        type: 'radio',
      },
      options: ['primary', 'secondary']
    },
    size: {
      type: 'string',
      description: 'Ширина кнопки 240 / 320 / 400',
      defaultValue: 'medium',
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large']
    }
  }
};

//👇 Мы создаем шаблон того, как аргументы соотносятся с отображением (рендерингом) в Storybook.
const Template = (args) => <MyButton {...args} />;

//👇 Затем каждая история повторно использует этот шаблон.
export const Primary = Template.bind({});
export const Secondary = Template.bind({});

Primary.args = {
  variant: 'primary',
  size: 'medium',
  children: 'Press me',
};

Secondary.args = {
  variant: 'secondary',
  size: 'medium',
  children: 'Press me',
};