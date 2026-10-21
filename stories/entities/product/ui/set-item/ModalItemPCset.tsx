import { placeholder_img } from '@/public/placeholder_img';
import { createProductImageSources } from '@stories/entities/product/model/productImage';
import { ResponsiveImage } from '@stories/shared/ui/responsive-image/ResponsiveImage';

import './ModalItemPCset.scss';

interface ModalItemPCsetProps {
  number: number;
  img_app: string;
  title: string;
  marc_desc?: string;
  tmp_desc?: string;
}

export const ModalItemPCset = ({
  number,
  img_app,
  title,
  marc_desc = '',
  tmp_desc = '',
}: ModalItemPCsetProps) => {
  const productImage = createProductImageSources(img_app, 'thumbnail');

  return (
    <div className="setItem">
      <span className="itemNumber">{number}.</span>

      <ResponsiveImage
        {...productImage}
        alt={title}
        width={366}
        height={366}
        fallbackSrc={placeholder_img}
      />

      <div className="itemDesc">
        <span>{title}</span>
        <span>{marc_desc.length > 0 ? marc_desc : tmp_desc}</span>
      </div>
    </div>
  );
};
