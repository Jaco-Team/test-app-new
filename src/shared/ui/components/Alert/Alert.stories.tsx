import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../primitives';
import { Button } from '../Button/Button';
import { Alert } from './Alert';
const meta = {
  title: 'UI/Компоненты/Уведомление',
  component: Alert,
  args: { title: 'Готово', children: 'Сообщение сохранено.' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Успех: Story = { args: { tone: 'success' } };
export const Предупреждение: Story = {
  args: { tone: 'warning', title: 'Проверьте данные' },
};
export const Ошибка: Story = { args: { tone: 'error', title: 'Ошибка' } };
export const Загрузка: Story = { args: { progress: 64, title: 'Загрузка' } };
export const ДлинныйТекст: Story = {
  args: {
    title: 'Очень длинный заголовок предупреждения',
    children:
      'Очень длинное сообщение для проверки переноса строк и поведения контейнера при разных ширинах.',
  },
};
export const Состояния: Story = {
  render: () => (
    <Stack>
      <Alert title="Инфо">Информационное сообщение.</Alert>
      <Alert tone="success" title="Готово">
        Сохранено.
      </Alert>
      <Alert tone="warning" title="Внимание">
        Нужна проверка.
      </Alert>
      <Alert
        tone="error"
        title="Ошибка"
        action={
          <Button tone="secondary" range="compact">
            Повторить
          </Button>
        }
      >
        Не удалось выполнить действие.
      </Alert>
    </Stack>
  ),
};
