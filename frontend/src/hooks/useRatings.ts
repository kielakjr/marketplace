  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { ratingsApi } from '@/api/ratingsApi';
  import type { SubmitRatingPayload } from '@/types/rating';

  export const ratingKeys = {
    userRatings: (userId: string) => ['ratings', 'user', userId] as const,
  };

  export function useUserRatings(userId: string) {
    return useQuery({
      queryKey: ratingKeys.userRatings(userId),
      queryFn: () => ratingsApi.getUserRatings(userId),
      enabled: !!userId,
    });
  }

  export function useSubmitRating(sellerId: string) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: SubmitRatingPayload) => ratingsApi.submitRating(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ratingKeys.userRatings(sellerId) });
      },
    });
  }
