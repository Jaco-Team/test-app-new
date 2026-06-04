import './HomeCatalogSkeleton.scss';

export function HomeCatalogSkeleton() {
  return (
    <div className="home-catalog-skeleton" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="home-catalog-skeleton__card" />
      ))}
    </div>
  );
}
