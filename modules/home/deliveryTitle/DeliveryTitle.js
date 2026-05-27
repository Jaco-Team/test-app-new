import { useCitiesStore } from '@/components/store.js';

const CITY_LOCATIVE_MAP = {
  Самара: 'Самаре',
};

function getCityLocative(cityNameRu) {
  return CITY_LOCATIVE_MAP[cityNameRu] ?? cityNameRu;
}

export default function DeliveryTitle({ cityNameRu = '', show = false }) {
  const thisCityRu = useCitiesStore((state) => state.thisCityRu);

  if (!show) {
    return null;
  }

  const displayCityRu = thisCityRu || cityNameRu;
  const cityLocative = getCityLocative(displayCityRu);
  if (!cityLocative) {
    return null;
  }

  return (
    <h1 className="homeDeliveryTitle">
      {`Доставка роллов и пиццы в ${cityLocative}`}
    </h1>
  );
}
