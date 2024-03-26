import { IconHeaderPC } from './IconHeaderPC';

export default {
  title: 'IconHeaderPC',
  component: IconHeaderPC,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Пиктограмма в шапке ПК',
      defaultValue: 'contacts',
      control: {
        type: 'radio',
      },
      options: ['contacts', 'profile', 'docs'],
    },
    active: {
      type: 'boolean',
      description: 'Активная страница сайта',
    },
  },
};

const Template = (args) => <IconHeaderPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});

Default.args = {
  title: 'contacts',
  active: false,
};

Active.args = {
  title: 'contacts',
  active: true,
};
