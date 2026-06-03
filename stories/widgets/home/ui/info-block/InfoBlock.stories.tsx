// InfoBlock.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import InfoBlock from './InfoBlock';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

const meta: Meta<typeof InfoBlock> = {
  title: 'Виджеты / Главная / Информационный блок',
  component: InfoBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Блок с информацией о компании, преимуществах и контактными данными. Поддерживает раскрытие/сворачивание дополнительного контента.',
      },
    },
  },
  argTypes: {
    // Компонент не принимает пропсов, но для документации можно описать
    // Если в будущем появятся пропсы, их можно добавить сюда
  },
};

export default meta;
type Story = StoryObj<typeof InfoBlock>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Стандартное состояние информационного блока со свёрнутым дополнительным контентом',
      },
    },
  },
};

export const Expanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Развёрнутое состояние блока (для демонстрации можно открыть вручную)',
      },
    },
  },
  render: () => {
    return <InfoBlock />;
  },
};

export const Mobile: Story = {
  args: {},
  globals: responsiveStoryGlobals.Mobile,
  parameters: {
    docs: {
      description: {
        story: 'Вид информационного блока на мобильных устройствах',
      },
    },
  },
};

export const Tablet: Story = {
  args: {},
  globals: responsiveStoryGlobals.Tablet,
  parameters: {
    docs: {
      description: {
        story: 'Вид информационного блока на планшетах',
      },
    },
  },
};

export const Desktop: Story = {
  args: {},
  globals: responsiveStoryGlobals.Desktop,
  parameters: {
    docs: {
      description: {
        story: 'Вид информационного блока на десктопе',
      },
    },
  },
};
