import { HeaderPC } from '../HeaderPC/HeaderPC';
import { BreadСrumbsPC } from '../BreadСrumbsPC/BreadСrumbsPC';
import { FooterPC } from '../FooterPC/FooterPC';

import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

import './DocsPagePC.scss';

export const DocsPagePC = ({ header, page, footer, data }) => {
  return (
    <>
      <HeaderPC {...header} />
      <Grid container>
        <div item className="docsPagePC">
          <h1>{page ? page.page_h : ''}</h1>
          {page && page.content ? <Grid item xs={12} dangerouslySetInnerHTML={{ __html: page.content }} /> : null}
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </Grid>
      <FooterPC {...footer} />
    </>
  );
};

DocsPagePC.propTypes = {
  header: PropTypes.object,
  page: PropTypes.object,
  footer: PropTypes.object,
  data: PropTypes.object,
};
