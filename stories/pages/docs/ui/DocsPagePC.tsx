// @ts-nocheck
import { BreadСrumbsPC } from '../../../shared/ui/breadcrumbs/BreadСrumbsPC';

import Grid from '@mui/material/Grid';

import './DocsPagePC.scss';

export const DocsPagePC = ({ header, page, footer, data }) => {
  return (
    <>
      {header ? null : null}
      <Grid container>
        <div item className="docsPagePC">
          <h1>{page ? page.page_h : ''}</h1>
          {page && page.content ? <Grid item xs={12} dangerouslySetInnerHTML={{ __html: page.content }} /> : null}
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </Grid>
      {footer ? null : null}
    </>
  );
};

