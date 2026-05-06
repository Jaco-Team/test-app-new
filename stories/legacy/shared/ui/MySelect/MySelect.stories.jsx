import MySelect from './MySelect';

export default {
  title: 'Элементы / Select',
  component: MySelect,
  tags: ['autodocs'],
  argTypes: {},
};

const Template = (args) => <MySelect {...args} />;

export const Default = Template.bind({});

Default.args = {};
