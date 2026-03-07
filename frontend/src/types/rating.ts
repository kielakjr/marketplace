  export interface UserRating {
    id: string;
    reviewee_id: string;
    reviewer_id: string;
    order_id: string;
    rating: number;
    comment?: string;
    reviewer: { username: string };
    createdAt: string;
    updatedAt: string;
  }

  export interface SubmitRatingPayload {
    orderId: string;
    rating: number;
    comment?: string;
  }
