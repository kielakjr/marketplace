import { Request, Response } from 'express';
import { UserRatingService } from '../services/userRating';

export async function submitRating(req: Request, res: Response) {
  try {
    const { orderId, rating, comment } = req.body;
    const reviewerId = req.user!.userId;

    const newRating = await UserRatingService.submitRating(reviewerId, orderId, rating, comment);
    res.status(201).json(newRating);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: 'Unknown error' });
  }
}

export async function getUserRatings(req: Request<{ userId: string }>, res: Response) {
  try {
    const userId = req.params.userId;
    const ratings = await UserRatingService.getUserRatings(userId);
    res.json(ratings);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: 'Unknown error' });
  }
}
