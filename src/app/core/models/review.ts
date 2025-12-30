import { User } from './auth';
import { Space } from './space';

export interface Review {
  id: number;
  user_id: number;
  space_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_flagged: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  space?: Space;
}

export interface CreateReviewRequest {
  space_id?: number;
  booking_id: number;
  rating: number;
  comment?: string;
}

export interface ModerateReviewRequest {
  reason: string;
}
