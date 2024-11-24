import Meta from '@/components/meta.js';
import Link from 'next/link';

import { useHeaderStoreNew } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import DocsBreadcrumbs from '@/components/docsBreadcrumbs.js';

import { ArrowLeftMobile } from '@/ui/Icons.js';

export default function PageText({ page, classNamePC, classNameMobile, cityName }) {
  const [matches, activePage] = useHeaderStoreNew((state) => [state.matches, state.activePage]);

  return (
    <Meta title={page.title} description={page.description}>
      <Grid container>
        <Grid item className={matches ? classNameMobile ?? classNamePC : classNamePC} style={{ minHeight: activePage === 'jobs' ? '50vh' : null }}>
          {!matches ? null : <Link href={'/' + cityName + '/document' } className='arrow'><ArrowLeftMobile /></Link>}

          <Grid item xs={12} style={{ paddingBottom: 15 }}>
            <Typography variant="h5" component="h1">
              {page ? page.page_h : ''}
            </Typography>
          </Grid>

          {page && page.content ? (
            <Grid
              item
              xs={12}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : null}
        </Grid>

        {!matches ? <DocsBreadcrumbs /> : null}
      </Grid>
    </Meta>
  );
}
