import { Delivery, Order } from "../models";

export class DeliveryService {
  static async getByOrderId(orderId: string, userId: string) {
    const order = await Order.findOne({ where: { id: orderId, buyer_id: userId } });
    if (!order) throw new Error("Order not found");

    const delivery = await Delivery.findOne({ where: { order_id: orderId } });
    if (!delivery) throw new Error("Delivery not found");
    return delivery;
  }

  static async update(deliveryId: string, data: { status?: string; tracking_number?: string }) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) throw new Error("Delivery not found");

    if (data.status === "DELIVERED") {
      const order = await Order.findByPk(delivery.order_id);
      if (order) await order.update({ status: "COMPLETED" });
    }

    return delivery.update(data);
  }

  static async markAsSent(deliveryId: string, userId: string) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) throw new Error("Delivery not found");

    const order = await Order.findByPk(delivery.order_id);
    if (!order || order.seller_id !== userId) throw new Error("Unauthorized");

    await delivery.update({ status: "SHIPPED" });
    if (order) await order.update({ status: "SHIPPED" });

    return delivery;
  }
}
