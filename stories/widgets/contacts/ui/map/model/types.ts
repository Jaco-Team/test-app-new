export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CenterMap {
  center: [number, number];
  zoom: number;
}

export interface Zone {
  xy_point: Coordinates;
  xy_center_map: Coordinates;
  image?: string;
}

export interface PointZone {
  zone: number[][];
  options?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    [key: string]: any;
  };
}

export interface MapProps {
  center_map?: CenterMap;
  zones?: Zone[];
  points_zone?: PointZone[];
  type_map?: 'active' | 'inactive' | string;
}
