// model/types.ts
import { ReactNode } from 'react';

export interface PageData {
  id?: string;
  page_id?: string;
  city_id?: string;
  page_h?: string;
  title?: string;
  description?: string;
  content?: string;
  date_time_update?: string;
}

export interface BreadcrumbsData {
  activePage?: string;
  [key: string]: any;
}

export interface DocsPageProps {
  header?: Record<string, any> | null;
  page?: PageData | null;
  footer?: Record<string, any> | null;
  data: BreadcrumbsData & {
    links: Array<{ text: string; href?: string; onClick?: () => void }>;
  };
}
