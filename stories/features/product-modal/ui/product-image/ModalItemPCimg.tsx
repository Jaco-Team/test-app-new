import './ModalItemPCimg.scss';
import { createProductImageSources } from '@stories/entities/product/model/productImage';

export const ModalItemPCimg = ({ img_name, title }: Record<string, any>) => {
  const image = createProductImageSources(img_name, 'hero');

  return (
    <picture>
      {image.sources.map(({ type, srcSet }) => (
        <source key={type} type={type} srcSet={srcSet} sizes={image.sizes} />
      ))}

      <img alt={title} src={image.src} loading="lazy" />
    </picture>
  );
};
