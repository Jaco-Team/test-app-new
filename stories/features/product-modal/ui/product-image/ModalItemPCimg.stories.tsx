import { ModalItemPCimg } from './ModalItemPCimg';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Фичи / Модалка товара / Изображение',
  component: ModalItemPCimg,
  tags: ['autodocs'],
  argTypes: {
    img_name: {
      type: 'string',
      description: 'Картинка'
    },
    title: {
      type: 'string',
      description: 'Название картинки'
    },
  },
};

const Template = (args) => <ModalItemPCimg {...args} />;
export const Default = Template.bind({});

Default.args = {
  title: 'Атлантида сет',
  img_name: 'Atlantida_set',
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
