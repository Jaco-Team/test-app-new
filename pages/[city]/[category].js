import { api } from '@/components/api.js';
import { normalizeCity } from '@/utils/normalizeCity';

export default function LegacyCategoryRoute() {
  return null;
}

export async function getServerSideProps({ query }) {
  const city = normalizeCity(query?.city);
  const category = String(query?.category || '')
    .trim()
    .toLowerCase();

  if (!city || !category) {
    return { notFound: true };
  }

  const data = await api('home', {
    type: 'get_page_info',
    city_id: city,
    page: category,
  });

  if (!data?.page) {
    return { notFound: true };
  }

  const categoryId = Number.parseInt(data.page.category_id, 10);
  const isCategory = categoryId > 0 || category === 'rolly';

  if (!isCategory) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/${city}/menu/${category}`,
      permanent: true,
    },
  };
}
