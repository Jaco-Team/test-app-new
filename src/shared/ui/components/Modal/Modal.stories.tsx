import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../primitives';
import { Button } from '../Button/Button';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Components/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Заголовок">
          <Text as="p">Контент модального окна.</Text>
        </Modal>
      </>
    );
  },
};
export const LongText: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Очень длинный заголовок модального окна"
      >
        <Text as="p">
          Длинный текст нужен для проверки переполнения, отступов и поведения
          контейнера при разных ширинах preview.
        </Text>
      </Modal>
    );
  },
};
export const Fullscreen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Полноэкранное окно"
        size="fullscreen"
      >
        <Text as="p">Состояние для плотного экрана.</Text>
      </Modal>
    );
  },
};
