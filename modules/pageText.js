import { useEffect, useRef } from 'react';
import Meta from '@/components/meta.js';
import Link from 'next/link';

import { useHeaderStoreNew } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import DocsBreadcrumbs from '@/components/docsBreadcrumbs.js';

import { ArrowLeftMobile } from '@/ui/Icons.js';

import { reachGoal } from '@/utils/metrika';

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

      if (cityName === 'samara' && link.href === 'https://b24-7m199r.bitrix24site.ru/crm_form_1trxt/') {
        reachGoal('go_to_job', {}, cityName);
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

          { activePage == 'pamiatka_po_sohraneniiu_zdorovia' &&
            <Grid item xs={12} style={{ paddingBottom: 15 }}>
              <a
                className='download'
                style={!matches ? {
                  textTransform: 'lowercase',
                  cursor: 'pointer',
                  backgroundColor: '#dd1a32',
                  borderRadius: '1.44404vw',
                  width: '12.2166vw',
                  height: '2.88809vw',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '3.5vw',
                  textDecoration: 'none',
                  fontFamily: 'var(--inter-font)',
                  
                } : {
                  textTransform: 'lowercase',
                  borderRadius: '5.12821vw',
                  width: '55.5556vw',
                  height: '10.2564vw',
                  marginTop: '8.54701vw',
                  marginBottom: '29.0598vw',
                  padding: '0',
                  backgroundColor: '#dd1a32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontFamily: 'var(--inter-font)',
                  justifySelf: 'center'
                }}
                href="https://storage.yandexcloud.net/site-other-data/health_reminder_jaco.pdf?response-content-disposition=attachment%3B%20filename%3Dhealth_reminder_jaco.pdf"
              >
                <span className='download_text' style={{color: '#fff', fontSize: '4.2735vw'}}>Скачать</span>
              </a>
            </Grid>
          }

        </Grid>

        {!matches ? <DocsBreadcrumbs /> : null}
      </Grid>
    </Meta>
  );
}
