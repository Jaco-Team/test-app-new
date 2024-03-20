import React from 'react';

import { MyCatLink } from './MyCatLink';

export default {
  title: 'MyCatLink',
  component: MyCatLink,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      type: 'string',
      description: 'Тип элемента, span или ссылка',
      defaultValue: 'text',
      control: {
        type: 'radio',
      },
      options: ['text', 'link']
    },
    bordered: {
      type: 'boolean',
      description: 'Обводка краев',
      defaultValue: 'medium',
      control: {
        type: 'radio',
      },
      options: [true, false]
    }
  }
};

//👇 Мы создаем шаблон того, как аргументы соотносятся с отображением (рендерингом) в Storybook.
const Template = (args) => <MyCatLink {...args} />;

//👇 Затем каждая история повторно использует этот шаблон.
export const Bordered = Template.bind({});
export const NoBordered = Template.bind({});

Bordered.args = {
  variant: 'text',
  bordered: true,
  children: 'Роллы',
};

NoBordered.args = {
  variant: 'text',
  bordered: false,
  children: 'Роллы',
};