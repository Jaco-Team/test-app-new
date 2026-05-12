import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './Header';
import headerData from '../../../fixtures/header.togliatti.json';

// Преобразуем данные из фикстур в формат для компонента
const categories = headerData.main_cat.map((item) => ({
  id: item.id,
  name: item.name,
  link: item.link,
  cats: (item.cats ?? []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    link: cat.link,
  })),
}));

const meta = {
  title: 'Widgets/Header/New',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    viewport: {
      control: 'select',
      options: ['mobile', 'tablet', 'desktop'],
      description: 'Тип отображения шапки',
      defaultValue: 'desktop',
    },
    scroll: {
      control: 'boolean',
      description: 'Активация тени при скролле страницы',
      defaultValue: false,
    },
    count: {
      control: 'text',
      description: 'Сумма товаров в корзине',
      defaultValue: '0',
    },
    activeMenu: {
      control: 'boolean',
      description: 'Активация мобильного меню (для mobile и tablet)',
      defaultValue: false,
    },
    menu: {
      description: 'Настройки мобильного меню',
    },
    onMenuToggle: {
      action: 'menuToggled',
      description: 'Колбек при клике на бургер меню',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== ДЕСКТОПНАЯ ВЕРСИЯ ====================

export const Desktop: Story = {
  args: {
    viewport: 'desktop',
    scroll: false,
    count: '0',
    activeMenu: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopMin',
    },
  },
};

export const DesktopWithShadow: Story = {
  args: {
    ...Desktop.args,
    scroll: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopMin',
    },
  },
};

export const DesktopWithBasket: Story = {
  args: {
    ...Desktop.args,
    count: '2500',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopMin',
    },
  },
};

// ==================== ПЛАНШЕТНАЯ ВЕРСИЯ ====================

export const Tablet: Story = {
  args: {
    viewport: 'tablet',
    scroll: false,
    count: '0',
    activeMenu: false,
    menu: {
      activePage: 'home',
      itemsCount: 0,
      isAuth: 'auth',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const TabletWithShadow: Story = {
  args: {
    ...Tablet.args,
    scroll: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const TabletWithBasket: Story = {
  args: {
    ...Tablet.args,
    count: '1250',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const TabletWithActiveMenu: Story = {
  args: {
    ...Tablet.args,
    activeMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tabletMin',
    },
  },
};

// Маленький планшет (600-800px) - с бургер меню
export const SmallTablet: Story = {
  args: {
    ...Tablet.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tabletMin',
      viewports: {
        smallTablet: {
          name: 'Small Tablet (600px)',
          styles: {
            width: '600px',
            height: '100%',
          },
        },
      },
    },
  },
};

export const SmallTabletWithActiveMenu: Story = {
  args: {
    ...SmallTablet.args,
    activeMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tabletMin',
    },
  },
};

// ==================== МОБИЛЬНАЯ ВЕРСИЯ ====================

export const Mobile: Story = {
  args: {
    viewport: 'mobile',
    scroll: false,
    count: '0',
    activeMenu: false,
    menu: {
      activePage: 'home',
      itemsCount: 0,
      isAuth: 'auth',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobileMin',
    },
  },
};

export const MobileWithActiveMenu: Story = {
  args: {
    ...Mobile.args,
    activeMenu: true,
    viewport: 'mobile',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobileMin',
    },
  },
};

export const MobileWithBasket: Story = {
  args: {
    ...Mobile.args,
    viewport: 'mobile',
    count: '1850',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobileMin',
    },
  },
};
