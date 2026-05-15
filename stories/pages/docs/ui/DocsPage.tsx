import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadCrumbs';
import type { BreadcrumbsData } from '@stories/fixtures/breadcrumbs';

import './DocsPage.scss';

interface DocsPageContent {
  page_h?: string;
  content?: string;
}

interface DocsPageProps {
  header?: unknown;
  page?: DocsPageContent;
  footer?: unknown;
  data: BreadcrumbsData;
}

export const DocsPage = ({ header, page, footer, data }: DocsPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className="docs-page__layout">
        <div className="docs-page">
          <h1>{page ? page.page_h : ''}</h1>
          {page && page.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : null}
        </div>
        <div>
          <BreadCrumbs {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
