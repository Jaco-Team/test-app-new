export type CityRecord = {
  link?: string;
  name?: string;
  [key: string]: unknown;
};

export type CityState = {
  slug: string;
  labelRu: string;
  list: CityRecord[];
  setCity: (slug: string, labelRu: string, list?: CityRecord[]) => void;
};
