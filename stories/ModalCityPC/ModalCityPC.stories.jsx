import { ModalCityPC } from './ModalCityPC';

export default {
  title: 'Header / Модалка выбора города',
  component: ModalCityPC,
  tags: ['autodocs'],
  argTypes: {
    city: {
      type: 'string',
      description: 'Название города',
    },
  },
};

const Template = (args) => <ModalCityPC {...args} />;
export const Default = Template.bind({});
export const Long_title_city = Template.bind({});

Default.args = {
  city: 'Тольятти',
};

Long_title_city.args = {
  city: 'Комсомольск-на-Амуре',
};
