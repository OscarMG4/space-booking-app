export interface Booking {
  id: number;
  user_id?: number;
  space_id?: number;
  event_title: string;
  event_description?: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  attendees_count?: number;
  special_requirements?: string;
  total_price?: number;
  cancellation_reason?: string;
  cancelled_at?: string;
  review_id?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  space?: {
    id: number;
    name: string;
    description?: string;
    type: string;
    capacity?: number;
    price_per_hour?: number;
    location: string;
    floor?: string;
    amenities?: string[];
    image_url?: string;
    is_available?: boolean;
    rules?: string;
    created_at?: string;
    updated_at?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    is_active?: boolean;
    is_admin?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateBookingRequest {
  space_id: number;
  event_title: string;
  event_description?: string;
  start_time: string;
  end_time: string;
  attendees_count?: number;
  special_requirements?: string;
}

export interface UpdateBookingRequest extends CreateBookingRequest {}

export interface CancelBookingRequest {
  cancellation_reason: string;
}
