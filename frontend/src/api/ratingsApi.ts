  import api from './axiosInstance';
  import type { UserRating, SubmitRatingPayload } from '@/types/rating';

  export const ratingsApi = {
    getUserRatings: (userId: string) =>
      api.get<UserRating[]>(`/ratings/user/${userId}`).then((res) => res.data),

    submitRating: (data: SubmitRatingPayload) =>
      api.post<UserRating>('/ratings/submit', data).then((res) => res.data),
  };
