import type { Meta, StoryObj } from '@storybook/react';
import PhotoUploader from './PhotoUploader';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

const meta: Meta<typeof PhotoUploader> = {
  title: 'Профиль / Заказы / Загрузчик фото',
  component: PhotoUploader,
  tags: ['autodocs'],
  argTypes: {
    maxPhotos: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Максимальное количество фотографий',
      defaultValue: 3,
    },
    onPhotosChange: {
      action: 'photosChanged',
      description: 'Колбэк при изменении списка фотографий',
    },
    onClose: {
      action: 'closed',
      description: 'Колбэк при закрытии (успешной отправке)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoUploader>;

export const Default: Story = {
  args: {
    maxPhotos: 3,
  },
};

export const MaxFivePhotos: Story = {
  args: {
    maxPhotos: 5,
  },
};

export const Mobile: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Desktop,
};
