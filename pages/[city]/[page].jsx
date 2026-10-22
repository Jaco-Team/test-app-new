import { loadHeaderCategories } from '@/utils/serverHeaderCategories';
import React from 'react';

import { api } from '@/components/api.js';
import CityTextPage from '@/modules/cityTextPage';
import { articleSchema, deliverySchema } from '@/utils/structuredData';
import { getCookie } from '@/utils/getCookie';
import { normalizeCity } from '@/utils/normalizeCity';
import { catalogRoute } from '@/utils/catalogRoute';
import {
  getCityTextPagePresentation,
  normalizeCityPageSlug,
  resolveCityPage,
  rewriteCityRelativeLinks,
} from '@/utils/cityPageRoute';

export default function CityPage({ data1, slug }) {
  return (
    <CityTextPage
      data1={data1}
      slug={slug}
      presentation={getCityTextPagePresentation(slug)}
    />
  );
}

export async function getServerSideProps({ req, res, params, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=60'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  const route = catalogRoute(
    params?.city ?? query?.city,
    params?.page ?? query?.page
  );
  const cityFromPath = route?.city ?? '';
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';
  const slug = normalizeCityPageSlug(route?.category);

  if (!cityFromPath || !slug) return { notFound: true };

  const resolution = await resolveCityPage({
    city,
    slug,
    loadPage: (cityId, pageSlug) =>
      api('contacts', {
        type: 'get_page_info',
        city_id: cityId,
        page: pageSlug,
      }),
  });

  if (resolution.type === 'redirect') {
    return {
      redirect: {
        destination: resolution.destination,
        permanent: resolution.permanent,
      },
    };
  }

  if (resolution.type === 'notFound') {
    return { notFound: true };
  }

  if (resolution.type === 'unavailable') {
    throw new Error('Unable to resolve city page: CMS API unavailable');
  }

  const data1 = resolution.data;
  const presentation = getCityTextPagePresentation(slug);
  const [footer, headerCategories] = await Promise.all([
    api('contacts', {
      type: 'get_page_info',
      city_id: city,
      page: 'info',
    }),
    loadHeaderCategories(city, data1.cats),
  ]);

  data1.links = footer?.page || {};
  data1.city = city;
  data1.headerCategories = headerCategories;

  if (presentation.rewriteCityLinks) {
    data1.page = {
      ...(data1.page ?? {}),
      content: rewriteCityRelativeLinks(data1.page?.content, city),
    };
  }

  if (presentation.schemaType === 'delivery') {
    data1.schema = deliverySchema(city, data1.page);
  } else if (presentation.schemaType === 'article') {
    data1.schema = articleSchema(city, data1.page);
  }

  return { props: { data1, slug } };
}
