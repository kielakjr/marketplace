import bcrypt from "bcrypt";
import { User, Cart } from "../models";
import { generateToken } from "../utils/jwt";
import { createUserSchema } from "../validation/user";
import { loginSchema, registerSchema } from "../validation/auth";

export class AuthService {
  static async register(data: { username: string; email: string; password: string }) {
    const validated = registerSchema.parse(data);

    const existingUser = await User.findOne({
      where: { email: validated.email },
    });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const existingUsername = await User.findOne({
      where: { username: validated.username },
    });
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const password_hash = await bcrypt.hash(validated.password, 10);

    const user = await User.create({
      username: validated.username,
      email: validated.email,
      password_hash,
    });

    await Cart.create({ user_id: user.id });

    const token = generateToken({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  static async login(data: { email: string; password: string }) {
    const validated = loginSchema.parse(data);

    const user = await User.findOne({ where: { email: validated.email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(validated.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const existingCart = await Cart.findOne({ where: { user_id: user.id } });
    if (!existingCart) {
      await Cart.create({ user_id: user.id });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "role", "createdAt", "updatedAt"],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
