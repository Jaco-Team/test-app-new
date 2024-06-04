import { ModalActiveVK_PC } from './ModalActiveVK_PC';

export default {
  title: 'Header / ПК / Модалка VK',
  component: ModalActiveVK_PC,
  tags: ['autodocs'],
  argTypes: {
    link: {
      type: 'string',
      description: 'Ссылка на группу в ВК',
    },
  },
};

const Template = (args) => <ModalActiveVK_PC {...args} />;
export const Default = Template.bind({});

Default.args = {
  link: 'https://vk.com/jacofood_tlt',
};
