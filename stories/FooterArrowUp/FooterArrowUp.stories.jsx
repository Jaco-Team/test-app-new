import { FooterArrowUp } from './FooterArrowUp';

export default {
  title: 'Footer / ArrowUp',
  component: FooterArrowUp,
  tags: ['autodocs'],
  argTypes: {
    arrow: {
      type: 'boolean',
      description: 'Активность стрелки навигации',
    },
  },
};

const Template = (args) => <FooterArrowUp {...args} />;
export const Default = Template.bind({});

Default.args = {
  arrow: true,
};
