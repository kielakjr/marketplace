import sequelize from '../db';
import { UserRating } from '../models/UserRating';
import { Order } from '../models/Order';
import { User } from '../models/User';

export class UserRatingService {
  static async submitRating(
    reviewerId: string,
    orderId: string,
    rating: number,
    comment?: string
  ): Promise<UserRating> {

    const order = await Order.findOne({
      where: { id: orderId, buyer_id: reviewerId }
    });

    if (!order) throw new Error('Order not found or unauthorized');

    if (order.status !== 'COMPLETED') {
      throw new Error('Can only rate completed orders');
    }

    return await sequelize.transaction(async (t) => {
      const newRating = await UserRating.create({
        reviewee_id: order.seller_id,
        reviewer_id: reviewerId,
        order_id: orderId,
        rating,
        comment,
      }, { transaction: t });

      await sequelize.query(`
        UPDATE users SET
          ratings_count = ratings_count + 1,
          avg_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM user_ratings
            WHERE reviewee_id = :revieweeId
          )
        WHERE id = :revieweeId
      `, {
        replacements: { revieweeId: order.seller_id },
        transaction: t,
      });

      return newRating;
    });
  }

  static async getUserRatings(userId: string) {
    return UserRating.findAll({
      where: { reviewee_id: userId },
      include: [{ model: User, as: 'reviewer', attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
    });
  }
}
