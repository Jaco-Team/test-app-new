import { ModalOrderDelete } from './ModalOrderDelete';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Профиль / Заказы / Модалка Отмены заказа',
  component: ModalOrderDelete,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      type: 'string',
      description: 'Выбранный вариант отмены заказа',
    },
    text: {
      type: 'string',
      description: 'Текст отказа',
    },
  },
};

const Template = (args) => <ModalOrderDelete {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Text_Active = Template.bind({});

Default.args = {
  variant: '',
  text: '',
};

Active.args = {
  variant: '1',
  text: '',
};

Text_Active.args = {
  variant: '6',
  text: 'Передумал',
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
