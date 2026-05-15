export interface CityItem {
  title: string;
}

export interface PointItem {
  addr: string;
}

export interface MenuContactsProps {
  city?: string;
  points?: PointItem[];
  phone?: string;
  disable?: boolean;
  active?: boolean;
}
