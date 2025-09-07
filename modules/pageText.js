import { useEffect, useRef } from 'react';
import Meta from '@/components/meta.js';
import Link from 'next/link';

import { useHeaderStoreNew } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import DocsBreadcrumbs from '@/components/docsBreadcrumbs.js';

import { ArrowLeftMobile } from '@/ui/Icons.js';

export default function PageText({ page, classNamePC, classNameMobile, cityName }) {
  const [matches, activePage] = useHeaderStoreNew((state) => [state.matches, state.activePage]);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const handleClick = (e) => {
      // ищем ближайший <a>
      const link = e.target.closest('a');
      if (!link) return;

      // свой колбэк (можно передавать весь элемент или href)
      //onLinkClick?.(link.href, link);

      //console.log( link.href, link )

      if( cityName == 'samara' && link.href === 'https://b24-7m199r.bitrix24site.ru/crm_form_1trxt/'){
        ym(100325084, 'reachGoal', 'go_to_job');
      }

       

      //e.preventDefault();
      /* ───────── optionally ─────────
         Если нужно остановить переход:
         e.preventDefault();
      */
    };

    // вешаем слушатель
    wrapperRef.current.addEventListener('click', handleClick);

    // снимаем при размонтировании / смене контента
    return () => {
      wrapperRef.current?.removeEventListener('click', handleClick);
    };
  }, [page?.content, cityName]);

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      <Grid container>
        <Grid item className={matches ? classNameMobile ?? classNamePC : classNamePC} style={{ minHeight: activePage === 'jobs' ? '50vh' : null }}>
          {!matches ? null : <Link href={'/' + cityName + '/document' } className='arrow'><ArrowLeftMobile /></Link>}

          <Grid item xs={12} style={{ paddingBottom: 15 }}>
            <Typography variant="h5" component="h1">
              {page ? page.page_h : ''}
            </Typography>
          </Grid>

          {page && page?.content ? (
            <Grid
              item
              xs={12}
              ref={wrapperRef}
              dangerouslySetInnerHTML={{ __html: page?.content }}
            />
          ) : null}
        </Grid>

        {!matches ? <DocsBreadcrumbs /> : null}
      </Grid>
    </Meta>
  );
}
