import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadCrumbs';

import './DocsPage.scss';

interface DocsPageContent {
  page_h?: string;
  content?: string;
}

interface DocsPageProps {
  header?: unknown;
  page?: DocsPageContent;
  footer?: unknown;
  data: Record<string, unknown>;
}

export const DocsPage = ({ header, page, footer, data }: DocsPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className="docsPagePC__layout">
        <div className="docsPagePC">
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
