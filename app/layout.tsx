import type { ReactNode } from 'react';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppProviders } from './providers';
import './layout.scss';

export const metadata = {
  title: 'Жако — preview',
  description: 'New FSD core preview',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
