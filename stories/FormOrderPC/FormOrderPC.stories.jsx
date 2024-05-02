import { FormOrderPC } from './FormOrderPC';

export default {
  title: 'Header / Модалка оформления заказа',
  component: FormOrderPC,
  tags: ['autodocs'],
  argTypes: {
    // title: {
    //   type: 'string',
    //   description: '',
    // },
  },
};

const Template = (args) => <FormOrderPC {...args} />;
export const Default = Template.bind({});
//export const Long_title_city = Template.bind({});

Default.args = {
  //city: 'Тольятти',
};

// Long_title_city.args = {
//   city: 'Комсомольск-на-Амуре',
// };
