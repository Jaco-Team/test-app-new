import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadСrumbs';
import Grid from '@mui/material/Grid';
import './DocsPage.scss';
import { useEffect, useState, useRef } from 'react';
import { DocsPageProps } from './model/types';
import BreadCrumbsPage from '@stories/pages/breadcrumbs/ui/BreadCrumbsPage';

export const DocsPage = ({ header, page, footer, data }: DocsPageProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {header ? null : null}
      <Grid container>
        <div className="docsPagePC">
          {open ? (
            <div
              style={{
                position: 'absolute',
                zIndex: 10000,
                backgroundColor: '#fff',
              }}
              onClick={() => setOpen(!open)}
            >
              <BreadCrumbsPage links={data?.links || []} />
            </div>
          ) : page?.content ? (
            <>
              <div className="docsPagePC-back" onClick={() => setOpen(!open)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 60 60"
                >
                  <g clipPath="url(#clip0_1487_4731)">
                    <path
                      fill="#000"
                      fillOpacity="0.3"
                      d="M29.996 60.009C13.425 60.009-.01 46.575-.01 30.004-.009 13.434 13.425 0 29.996 0 46.566 0 60 13.433 60 30.004S46.567 60.01 29.996 60.01z"
                    ></path>
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M33.75 17.5L21.244 30.006 33.75 42.504"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1487_4731">
                      <path
                        fill="#fff"
                        d="M0 0H60V60H0z"
                        transform="matrix(-1 0 0 1 60 0)"
                      ></path>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h1>{page?.page_h ?? ''}</h1>
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
              <div>{data ? <BreadCrumbs {...data} /> : null}</div>
            </>
          ) : null}
        </div>
      </Grid>
      {footer ? null : null}
    </>
  );
};
