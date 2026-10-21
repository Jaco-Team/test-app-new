import { api } from '@/components/api.js';
import { catalogRoute } from '@/utils/catalogRoute';

export default function LegacyCategoryRoute() {
  return null;
}

export async function getServerSideProps({ params, query }) {
  const route = catalogRoute((params || query)?.city, (params || query)?.category);
  if (!route) return { notFound: true };
  const { city, category } = route;

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
