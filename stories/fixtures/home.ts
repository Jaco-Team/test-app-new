import bannersData from './banners.togliatti.json';
import homeProductsData from './home-products.togliatti.json';
import type { ProductItem } from '@stories/entities/product/ui/product-card/model/types';
import type { Banner } from '@stories/widgets/home/ui/banner-list/model/types';

export const homeBannerList = bannersData.bannersList as Banner[];
export const homeProductCards: ProductItem[] = homeProductsData.allItems
  .slice(0, 24)
  .map((name, index) => ({
    id: String(index + 1),
    name,
    tmp_desc: '',
    marc_desc: 'Описание товара будет перенесено из каталога.',
    marc_desc_full: '',
    size_pizza: '0',
    count_part: '8',
    weight: '250',
    price: '399',
    count: '0',
    link: '',
    img_app: '',
    cat_id: '',
    cat_name: '',
    is_new: '0',
    is_hit: '0',
    is_updated: '0',
    tags: [],
  }));
