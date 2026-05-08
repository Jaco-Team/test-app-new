// @ts-nocheck
import { ModalItemPCimg } from './ModalItemPCimg';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Главная страница / Товар / Модальное окно Товара / Изображение',
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
