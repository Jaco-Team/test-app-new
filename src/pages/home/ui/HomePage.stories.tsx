import type { Meta, StoryObj } from '@storybook/react';
import { mapHomePageViewModel } from '../model/mapHomePageViewModel';
import { productCardFixtures } from '@ui/fixtures/productFixtures';
import { HomePage } from './HomePage';

const storyModel = mapHomePageViewModel({
  city: 'samara',
  page: { title: 'Жако Самара' },
  cats: [],
  cities: [{ link: 'samara', name: 'Самара' }],
  all_items: [],
  free_items: [],
  need_dop: [],
  tags: [],
  links: { link_vk: 'https://vk.com', link_tg: 'https://t.me' },
  banners: [],
});

const meta = {
  title: 'Страницы/Главная',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
  args: {
    model: storyModel,
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Превью: Story = {
  name: 'Превью',
};

export const Compact: Story = {
  name: 'Компактный',
  parameters: { viewport: { defaultViewport: 'mobileMin' } },
};

export const Regular: Story = {
  name: 'Обычный',
  parameters: { viewport: { defaultViewport: 'tabletMin' } },
};

export const Expanded: Story = {
  name: 'Расширенный',
  parameters: { viewport: { defaultViewport: 'desktopMin' } },
};
