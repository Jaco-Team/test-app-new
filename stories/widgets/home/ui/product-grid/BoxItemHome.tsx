import { ItemHome } from '@stories/entities/product/ui/product-card/ItemHome';

import './BoxItemHome.scss';
import React, { useState } from 'react';
import { placeholder_img } from '@/public/placeholder_img';
import ProductModal from '@stories/entities/product/ui/product-modal/ProductModal';
import type { ProductItem } from '@stories/entities/product/ui/product-card/model/types';

interface BoxItemHomeProps {
  cards: ProductItem[];
}

export const BoxItemHome = ({ cards }: BoxItemHomeProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <ProductModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        productImage="https://mainimg.jacofood.ru/Atlantida_set_292x292.jpg"
      />
      <div className="containerItemHomePC" onClick={() => setIsOpenModal(true)}>
        {cards.map((item, key) => (
          <ItemHome key={key} {...item} />
        ))}
      </div>
    </>
  );
};
