import MyTextInput from './MyTextInput';

export default {
  title: 'Элементы / Input',
  component: MyTextInput,
  tags: ['autodocs'],
  argTypes: {},
};

const Template = (args) => <MyTextInput {...args} />;

export const Default = Template.bind({});

Default.args = {};
