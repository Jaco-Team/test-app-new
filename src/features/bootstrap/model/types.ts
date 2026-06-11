export type StoreBootstrapProps = {
  city: string;
  cities: unknown[];
  cats: unknown[];
  allItems: unknown[];
  tags: unknown[];
  links: Record<string, unknown>;
  freeItems?: unknown[];
  needDop?: unknown;
  activePage?: string;
  page?: Record<string, unknown> | null;
};
