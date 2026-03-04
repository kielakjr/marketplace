import { Payment, Order } from "../models";

export class PaymentService {
  static async getByOrderId(orderId: string, userId: string) {
    const order = await Order.findOne({ where: { id: orderId, buyer_id: userId } });
    if (!order) throw new Error("Order not found");

    const payment = await Payment.findOne({ where: { order_id: orderId } });
    if (!payment) throw new Error("Payment not found");
    return payment;
  }

  static async processPayment(orderId: string, userId: string, paymentGatewayId?: string) {
    const order = await Order.findOne({ where: { id: orderId, buyer_id: userId } });
    if (!order) throw new Error("Order not found");
    if (order.status === "CANCELLED") throw new Error("Cannot pay for cancelled order");

    const payment = await Payment.findOne({ where: { order_id: orderId } });
    if (!payment) throw new Error("Payment not found");
    if (payment.status === "PAID") throw new Error("Payment already processed");

    await payment.update({ status: "PAID", payment_gateway_id: paymentGatewayId || null });
    await order.update({ status: "PROCESSING" });

    return payment;
  }

  static async updateStatus(paymentId: string, status: string, paymentGatewayId?: string) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error("Payment not found");
    return payment.update({ status, payment_gateway_id: paymentGatewayId || payment.payment_gateway_id });
  }
}
