export interface Space {
  id: number;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  price_per_hour: number;
  location: string;
  floor?: string;
  amenities?: string[];
  image_url?: string;
  is_available: boolean;
  rules?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  reviews?: any[];
  availabilities?: any[];
}

export type SpaceType =
  | 'sala_reuniones'
  | 'oficina'
  | 'auditorio'
  | 'laboratorio'
  | 'espacio_coworking'
  | 'otro';

export interface CreateSpaceRequest {
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  price_per_hour: number;
  location: string;
  floor?: string;
  amenities?: string[];
  image_url?: string;
  is_available?: boolean;
  rules?: string;
}

export interface UpdateSpaceRequest extends CreateSpaceRequest {}

export interface SpaceFilters {
  type?: SpaceType;
  is_available?: boolean;
  min_capacity?: number;
  max_price?: number;
  search?: string;
}
