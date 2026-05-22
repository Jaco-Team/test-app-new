import { FooterCookie } from './FooterCookie';

export default {
  title: 'Footer / Cookie',
  component: FooterCookie,
  tags: ['autodocs'],
  argTypes: {
    cityName: {
      type: 'string',
      description: 'Ссылка на выбранный город',
    },
  },
};

const Template = (args) => <FooterCookie {...args} />;
export const Default = Template.bind({});

Default.args = {
  cityName: 'samara',
};
