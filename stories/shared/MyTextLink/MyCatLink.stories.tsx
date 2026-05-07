import React from 'react';

import { MyCatLink } from './MyCatLink';

export default {
  title: 'Header / ПК / Категории',
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
export const NoBorderedArrow = Template.bind({});

Bordered.args = {
  variant: 'text',
  bordered: true,
  children: 'Роллы',
  arrow: false
};

NoBordered.args = {
  variant: 'text',
  bordered: false,
  children: 'Роллы',
  arrow: false
};

NoBorderedArrow.args = {
  variant: 'text',
  bordered: false,
  children: 'Роллы',
  arrow: true
};
