import React from 'react';

import { MyButton } from './MyButton';

export default {
  title: 'Элементы / Кнопки',
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
      options: ['primary', 'secondary', 'city', 'auth', 'cart'],
      if: { arg: 'element', neq: 'modal' },
    },
    size: {
      type: 'string',
      description: 'Ширина кнопки 240 / 320 / 400 / 560',
      defaultValue: 'medium',
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'big'],
      if: { arg: 'variant', neq: 'modal' },
    },
    arrow: {
      type: 'boolean',
      description: 'Наличие стрелки в кнопке',
      if: { arg: 'variant', eq: 'city' },
    },
    isOpen: {
      type: 'boolean',
      description: 'Отслеживание нажатия кнопки',
      if: { arg: 'variant', eq: 'city' },
    },
    children: {
      type: 'node',
      description: 'Текст в кнопке',
    },
    element: {
      type: 'string',
      description: 'Элемент в котором используется кнопка',
      if: { arg: 'variant', eq: 'modal' },
    },
    count: {
      type: 'number',
      description: 'Количество товара',
      if: { arg: 'variant', eq: 'modal' },
    },
    typeModal: {
      type: 'string',
      description: 'Тип модального окна',
      if: { arg: 'variant', eq: 'modal' },
    },
  }
};

const Template = (args) => <MyButton {...args} />;

export const Primary = Template.bind({});
export const Secondary = Template.bind({});
export const City = Template.bind({});
export const Auth = Template.bind({});
export const Modal = Template.bind({});
export const Modal_Active = Template.bind({});
export const Cart = Template.bind({});

Primary.args = {
  variant: 'primary',
  size: 'medium',
  children: 'Press me',
  arrow: false,
  isOpen: false,
};

Secondary.args = {
  variant: 'secondary',
  size: 'medium',
  children: 'Press me',
  arrow: false,
  isOpen: false,
};

City.args = {
  variant: 'city',
  size: 'medium',
  children: 'Press me',
  arrow: true,
  isOpen: false,
};

Auth.args = {
  variant: 'auth',
  size: 'medium',
  children: 'Press me',
  arrow: false,
  isOpen: false,
};

Cart.args = {
  variant: 'cart',
  size: 'big',
  children: 'Press me',
  arrow: false,
  isOpen: false,
};

Modal.args = {
  variant: 'modal',
  children: '500',
  count: 0,
  typeModal: 'start',
  element: 'modal',
};

Modal_Active.args = {
  variant: 'modal',
  children: '',
  count: 1,
  typeModal: 'start',
  element: 'modal',
};


