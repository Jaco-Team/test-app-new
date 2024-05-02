import { FormOrderPC_btn } from './FormOrderPC_btn';

export default {
  title: 'Header / Модалка оформления заказа / Кнопка выбора',
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
  },
};

const Template = (args) => <FormOrderPC_btn {...args} />;
export const Default = Template.bind({});
//export const Long_title_city = Template.bind({});

Default.args = {
  text: 'тольятти',
  icon: 'city',
};

// Long_title_city.args = {
//   city: 'Комсомольск-на-Амуре',
// };
