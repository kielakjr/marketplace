import { Payment, Order } from "../models";
import { stripe } from "../utils/stripe";
import Stripe from "stripe";

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

  static async createPaymentIntent(orderId: string, userId: string) {
    const order = await Order.findOne({ where: { id: orderId, buyer_id: userId } });
    if (!order) throw new Error("Order not found");
    if (order.status === "CANCELLED") throw new Error("Cannot pay for cancelled order");

    const payment = await Payment.findOne({ where: { order_id: orderId } });
    if (!payment) throw new Error("Payment not found");
    if (payment.status === "PAID") throw new Error("Payment already processed");

    if (payment.payment_gateway_id) {
      const existingPI = await stripe.paymentIntents.retrieve(payment.payment_gateway_id);
      return { clientSecret: existingPI.client_secret };
    }

    const amount = Math.round(parseFloat(payment.amount as unknown as string) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "pln",
      metadata: {
        order_id: orderId,
        payment_id: payment.id,
        buyer_id: userId,
      },
    });

    await payment.update({ payment_gateway_id: paymentIntent.id });

    return { clientSecret: paymentIntent.client_secret };
  }

  static async handleWebhookEvent(event: Stripe.Event) {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({ where: { payment_gateway_id: pi.id } });
      if (!payment || payment.status === "PAID") return;

      await payment.update({ status: "PAID" });
      const order = await Order.findByPk(payment.order_id);
      if (order && order.status !== "PROCESSING") {
        await order.update({ status: "PROCESSING" });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({ where: { payment_gateway_id: pi.id } });
      if (!payment) return;

      await payment.update({ status: "FAILED" });
    }
  }
}
