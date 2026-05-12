import { FormOrderPC_btn } from './FormOrderPC_btn';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Cart / ПК / Модалка оформления заказа / Элемент выбора',
  component: FormOrderPC_btn,
  tags: ['autodocs'],
  argTypes: {
    text: {
      type: 'string',
      description: 'Текст в кнопке',
    },
    icon: {
      type: 'string',
      description: 'Иконка в кнопке',
    },
    placeholder: {
      type: 'string',
      description: 'Текст-заполнитель кнопки, до выбора',
    },
    open: {
      type: 'boolean',
      description: 'Открытие/закрытие меню',
    },
  },
};

const Template = (args) => <FormOrderPC_btn {...args} />;
export const Default = Template.bind({});
export const Placeholder = Template.bind({});
export const Sdacha = Template.bind({});
export const Long_text = Template.bind({});
export const Message = Template.bind({});
export const Message_Active = Template.bind({});

Default.args = {
  text: 'тольятти',
  icon: 'city',
  placeholder: '',
  open: false,
};

Placeholder.args = {
  text: '',
  icon: 'card',
  placeholder: 'Способ оплаты',
  open: false,
};

Long_text.args = {
  text: 'бульвар 50 лет Октября, д. 6, корп. 13Б, кв 45, п. 3',
  icon: 'home',
  placeholder: '',
  open: false,
};

Sdacha.args = {
  text: '1000',
  icon: 'sdacha',
  placeholder: 'Без сдачи',
  open: false,
};

Message.args = {
  text: '',
  icon: 'comment',
  placeholder: 'Сообщение курьеру',
  open: false,
};

Message_Active.args = {
  text: 'Домофон работает. Прошу позвонить заранее. Лифт не работает.',
  icon: 'comment',
  placeholder: '',
  open: false,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
