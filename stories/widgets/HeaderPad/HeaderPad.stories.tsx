import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HeaderPad } from './HeaderPad';
import * as NavBarMobile from '../NavBarMobile/NavBarMobile.stories';

const meta: Meta<typeof HeaderPad> = {
  title: 'Header / Планшет / HeaderPad',
  component: HeaderPad,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'tablet',
      viewports: {
        smallTablet: {
          name: 'Small Tablet (600px)',
          styles: {
            width: '600px',
            height: '100%',
          },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: {
            width: '768px',
            height: '100%',
          },
        },
        iPad: {
          name: 'iPad (810px)',
          styles: {
            width: '810px',
            height: '1080px',
          },
        },
        iPadPro: {
          name: 'iPad Pro (1024px)',
          styles: {
            width: '1024px',
            height: '1366px',
          },
        },
      },
    },
  },
  argTypes: {
    scroll: {
      type: 'boolean',
      description: 'Активация тени при скролле страниц сайта',
      defaultValue: false,
    },
    count: {
      type: 'string',
      description: 'Сумма товара в корзине',
      defaultValue: '0',
    },
    activeMenu: {
      type: 'boolean',
      description: 'Активация мобильного мену (для маленьких планшетов)',
      defaultValue: false,
    },
    onMenuToggle: {
      action: 'menuToggled',
      description: 'Колбек при клике на бургер меню',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderPad>;

// Базовая версия для планшетов
export const Default: Story = {
  args: {
    scroll: false,
    count: '0',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPad',
    },
  },
};

// С тенью при скролле
export const WithShadow: Story = {
  args: {
    scroll: true,
    count: '0',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPad',
    },
  },
};

// С товарами в корзине
export const WithBasketItems: Story = {
  args: {
    scroll: false,
    count: '1250',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPad',
    },
  },
};

// Для маленьких планшетов (600px-800px) - с бургер меню
export const SmallTablet: Story = {
  args: {
    scroll: false,
    count: '0',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'smallTablet',
    },
  },
};

// С открытым мобильным меню для маленьких планшетов
export const WithActiveMenu: Story = {
  args: {
    scroll: false,
    count: '0',
    activeMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'smallTablet',
    },
  },
};

// Для iPad Pro
export const IPadPro: Story = {
  args: {
    scroll: false,
    count: '3500',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPadPro',
    },
  },
};

// Интерактивная история с анимацией
export const Interactive: Story = {
  args: {
    scroll: false,
    count: '0',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iPad',
    },
  },
  play: async ({ canvasElement }) => {
    // Можно добавить интерактивные тесты если нужно
  },
};
