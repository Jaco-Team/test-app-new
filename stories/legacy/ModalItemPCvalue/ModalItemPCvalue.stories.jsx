import { ModalItemPCvalue } from './ModalItemPCvalue';

export default {
  title: 'Главная страница / Товар / Модальное окно Товара / БЖУ товара',
  component: ModalItemPCvalue,
  tags: ['autodocs'],
  argTypes: {
    number: {
      type: 'number',
      description: 'Порядковый номер товара',
    },
    title: {
      type: 'string',
      description: 'Название товара',
    },
    kkal: {
      type: 'string',
      description: 'Количестов каллорий в товаре',
    },
    tmp_desc: {
      type: 'string',
      description: 'Состав товара',
    },
    protein: {
      type: 'string',
      description: 'Количество протеина в товаре',
    },
    fat: {
      type: 'string',
      description: 'Количество жиров в товаре',
    },
    carbohydrates: {
      type: 'string',
      description: 'Количество углеводов в товаре',
    },
  },
};

const Template = (args) => <ModalItemPCvalue {...args} />;
export const Default = Template.bind({});
export const LongText = Template.bind({});

Default.args = {
  number: 1,
  title: 'Гавайи жареный',
  kkal: '173',
  tmp_desc:
    'Состав: куриное филе, ананас, творожный сыр, панировочные сухари, соус белый',
  protein: '4,9',
  fat: '8,9',
  carbohydrates: '18,6',
};

LongText.args = {
  number: 1,
  title: 'Филадельфия с лососем запечённый спайси',
  kkal: '173',
  tmp_desc:
    'Состав: вода, сахар, концентрированный апельсиновый сок, регулятор кислотности, лимонная кислота, консервант сорбат калия ароматизаторы, антиокислитель аскорбиновая кислота, стабилизатор гуммиарабик, подсластители (сукралоза, ацесульфам калия), красители (бета-апо-8` каротиновый альдегид (C30), каротины).',
  protein: '4,9',
  fat: '8,9',
  carbohydrates: '18,6',
};
