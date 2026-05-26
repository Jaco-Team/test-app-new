import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { PopoverMenu } from './PopoverMenu';

const meta = {
  title: 'UI/Компоненты/PopoverMenu',
  component: PopoverMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PopoverMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = {
  name: 'По умолчанию',
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
      <>
        <Button onClick={(event) => setAnchorEl(event.currentTarget)}>
          Документы
        </Button>
        <PopoverMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          items={[
            { label: 'О компании', href: '#' },
            { label: 'Реквизиты', href: '#' },
            { label: 'Публичная оферта', href: '#' },
            { label: 'Политика конфиденциальности', href: '#' },
          ]}
        />
      </>
    );
  },
};
