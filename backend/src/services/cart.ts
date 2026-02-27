import { Cart, CartItem, Product } from "../models";

export class CartService {
  static async getCart(userId: string) {
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "image_url", "price", "quantity_available"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      cart = await Cart.findOne({
        where: { id: cart.id },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "image_url", "price", "quantity_available"],
              },
            ],
          },
        ],
      });
    }

    return cart;
  }

  static async addItem(userId: string, productId: string, quantity: number) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.quantity_available < quantity) {
      throw new Error("Insufficient stock");
    }

    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    const existingItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.quantity_available) {
        throw new Error("Insufficient stock");
      }
      await existingItem.update({ quantity: newQuantity });
      return this.getCartItemWithProduct(existingItem.id);
    }

    const newItem = await CartItem.create({
      cart_id: cart.id,
      product_id: productId,
      quantity,
    });

    return this.getCartItemWithProduct(newItem.id);
  }

  static async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });
    if (!item) {
      throw new Error("Cart item not found");
    }

    const product = await Product.findByPk(item.product_id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (quantity > product.quantity_available) {
      throw new Error("Insufficient stock");
    }

    await item.update({ quantity });
    return this.getCartItemWithProduct(item.id);
  }

  static async removeItem(userId: string, itemId: string) {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });
    if (!item) {
      throw new Error("Cart item not found");
    }

    await item.destroy();
  }

  static async clearCart(userId: string) {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    await CartItem.destroy({ where: { cart_id: cart.id } });
  }

  private static async getCartItemWithProduct(itemId: string) {
    return CartItem.findByPk(itemId, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "image_url", "price", "quantity_available"],
        },
      ],
    });
  }
}
