import sequelize from "../db";
import { Order, OrderItem, Product, Payment, Delivery, User, CartItem, Cart } from "../models";

export class OrderService {
  static async createOrder(userId: string, items: { product_id: string; quantity: number }[], addressDetails: string) {
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItemsData: { product_id: string; quantity: number; price_per_unit: number }[] = [];

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction });
        if (!product) {
          throw new Error(`Product ${item.product_id} not found`);
        }
        if (product.quantity_available < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}"`);
        }

        const pricePerUnit = parseFloat(product.price.toString());
        totalAmount += pricePerUnit * item.quantity;
        orderItemsData.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_unit: pricePerUnit,
        });
      }

      const order = await Order.create(
        { user_id: userId, total_amount: totalAmount, status: "PENDING" },
        { transaction }
      );

      for (const item of orderItemsData) {
        await OrderItem.create(
          { order_id: order.id, ...item },
          { transaction }
        );

        await Product.update(
          { quantity_available: sequelize.literal(`quantity_available - ${item.quantity}`) },
          { where: { id: item.product_id }, transaction }
        );
      }

      await Payment.create(
        { order_id: order.id, amount: totalAmount, status: "PENDING" },
        { transaction }
      );

      await Delivery.create(
        { order_id: order.id, address_details: addressDetails, status: "PREPARING" },
        { transaction }
      );

      const cart = await Cart.findOne({ where: { user_id: userId }, transaction });
      if (cart) {
        await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
      }

      await transaction.commit();

      return this.getOrderById(order.id, userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getUserOrders(userId: string) {
    return Order.findAll({
      where: { user_id: userId },
      include: [
        { model: Product, through: { attributes: ["quantity", "price_per_unit"] } },
        { model: Payment, as: "payment" },
        { model: Delivery, as: "delivery" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async getOrderById(orderId: string, userId: string) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        { model: Product, through: { attributes: ["quantity", "price_per_unit"] } },
        { model: Payment, as: "payment" },
        { model: Delivery, as: "delivery" },
      ],
    });
    if (!order) throw new Error("Order not found");
    return order;
  }

  static async cancelOrder(orderId: string, userId: string) {
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        include: [{ model: Product, through: { attributes: ["quantity", "price_per_unit"] } }],
        transaction,
      });
      if (!order) throw new Error("Order not found");
      if (order.status === "CANCELLED") throw new Error("Order already cancelled");
      if (order.status === "COMPLETED" || order.status === "SHIPPED") {
        throw new Error("Cannot cancel shipped/completed order");
      }

      for (const product of order.products) {
        const orderItem = (product as any).OrderItem;
        await Product.update(
          { quantity_available: sequelize.literal(`quantity_available + ${orderItem.quantity}`) },
          { where: { id: product.id }, transaction }
        );
      }

      await order.update({ status: "CANCELLED" }, { transaction });
      await Payment.update({ status: "REFUNDED" }, { where: { order_id: orderId }, transaction });

      await transaction.commit();
      return this.getOrderById(orderId, userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllOrders() {
    return Order.findAll({
      include: [
        { model: User, as: "buyer", attributes: ["id", "username", "email"] },
        { model: Product, through: { attributes: ["quantity", "price_per_unit"] } },
        { model: Payment, as: "payment" },
        { model: Delivery, as: "delivery" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");
    await order.update({ status });
    return order;
  }
}
