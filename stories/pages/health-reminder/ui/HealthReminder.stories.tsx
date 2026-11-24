import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import article from '../content/health-reminder.html?raw';

function HealthReminderPreview({ city }: { city: 'Тольятти' | 'Самара' }) {
  return (
    <main lang="ru" style={{ maxWidth: 820, margin: '0 auto', padding: '16px clamp(16px, 4vw, 40px) 48px' }}>
      <link rel="stylesheet" href="/health-reminder/health-reminder.css" />
      <h1>Памятка по сохранению здоровья {city}</h1>
      <div dangerouslySetInnerHTML={{ __html: article }} />
      <a href="https://storage.yandexcloud.net/site-other-data/health_reminder_jaco.pdf?response-content-disposition=attachment%3B%20filename%3Dhealth_reminder_jaco.pdf">
        Скачать памятку в PDF
      </a>
    </main>
  );
}

const meta = {
  title: 'Страницы/Документы/Памятка по сохранению здоровья',
  component: HealthReminderPreview,
  parameters: { layout: 'fullscreen' },
  args: { city: 'Тольятти' },
  argTypes: { city: { name: 'Город', options: ['Тольятти', 'Самара'], control: 'select' } },
} satisfies Meta<typeof HealthReminderPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = { name: 'Телефон', globals: responsiveStoryGlobals.Mobile };
export const Tablet: Story = { name: 'Планшет', globals: responsiveStoryGlobals.Tablet };
export const Desktop: Story = {
  name: 'Компьютер',
  args: { city: 'Самара' },
  globals: responsiveStoryGlobals.Desktop,
};
