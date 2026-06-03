import type { Meta, StoryObj } from '@storybook/react';
import CommentInput from './ModalComment';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

const meta: Meta<typeof CommentInput> = {
  title: 'Профиль / Заказы / Поле ввода комментария',
  component: CommentInput,
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 50, max: 500 },
      description: 'Максимальная длина комментария',
      defaultValue: 260,
    },
    placeholder: {
      control: 'text',
      description: 'Плейсхолдер текстового поля',
      defaultValue: 'Ваш комментарий',
    },
    onCommentChange: {
      action: 'commentChanged',
      description: 'Колбэк при изменении комментария',
    },
    onPhotoAdd: {
      action: 'photoAdd',
      description:
        'Колбэк при клике на добавление/изменение фото (передаётся индекс)',
    },
    photoPreviews: {
      control: 'object',
      description:
        'Массив превью фотографий (для отображения загруженных фото)',
      defaultValue: [null, null, null],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommentInput>;

export const Default: Story = {
  args: {
    maxLength: 260,
    placeholder: 'Ваш комментарий',
    photoPreviews: [null, null, null],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Стандартное состояние компонента с тремя кнопками для добавления фото',
      },
    },
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    maxLength: 200,
    placeholder: 'Напишите ваш отзыв здесь...',
    photoPreviews: [null, null, null],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Компонент с кастомным плейсхолдером и ограничением в 200 символов',
      },
    },
  },
};

export const WithPhotos: Story = {
  args: {
    maxLength: 260,
    placeholder: 'Ваш комментарий',
    photoPreviews: [
      'https://picsum.photos/id/1/200/150',
      'https://picsum.photos/id/2/200/150',
      'https://picsum.photos/id/3/200/150',
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние когда все три фото уже загружены',
      },
    },
  },
};

export const WithTwoPhotos: Story = {
  args: {
    maxLength: 260,
    placeholder: 'Ваш комментарий',
    photoPreviews: [
      'https://picsum.photos/id/10/200/150',
      'https://picsum.photos/id/20/200/150',
      null,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние когда загружены два фото из трёх',
      },
    },
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
