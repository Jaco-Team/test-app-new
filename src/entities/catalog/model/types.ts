export type CatalogCategory = {
  id?: string | number;
  name?: string;
  link?: string;
  main_link?: string;
  parent_id?: string | number;
  cats?: CatalogCategory[];
  expanded?: boolean;
  [key: string]: unknown;
};

export type CatalogState = {
  categories: CatalogCategory[];
  tags: unknown[];
  allItems: unknown[];
  seedFromPage: (
    cats: unknown[],
    allItems: unknown[],
    citySlug: string,
    tags?: unknown[]
  ) => void;
};
