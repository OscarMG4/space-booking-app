export interface Booking {
  id: number;
  user_id: number;
  space_id: number;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  purpose: string;
  event_title: string;
  event_description?: string;
  attendees_count: number;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  space?: {
    id: number;
    name: string;
    type: string;
    location: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateBookingRequest {
  space_id: number;
  start_time: string;
  end_time: string;
  event_title: string;
  event_description?: string;
  attendees_count: number;
  special_requirements?: string;
}

export interface UpdateBookingRequest extends CreateBookingRequest {}
