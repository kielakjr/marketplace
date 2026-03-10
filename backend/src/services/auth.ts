import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";
import { User } from "../models";
import { generateToken } from "../utils/jwt";
import { sendPasswordResetEmail } from "../utils/email";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/auth";

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

    if (user.status === 'BANNED') {
      throw new Error('Your account has been banned.');
    }
    
    if (user.status === 'DEACTIVATED') {
      throw new Error('Your account has been deactivated.');
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

  static async forgotPassword(data: { email: string }) {
    const validated = forgotPasswordSchema.parse(data);

    const user = await User.findOne({ where: { email: validated.email } });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

      await user.update({
        password_reset_token_hash: hash,
        password_reset_expires: new Date(Date.now() + 30 * 60 * 1000),
      });

      await sendPasswordResetEmail(user.email, rawToken);
    }

    return {
      message: "Jeśli konto z tym adresem email istnieje, link do resetu hasła został wysłany.",
    };
  }

  static async resetPassword(data: { token: string; password: string }) {
    const validated = resetPasswordSchema.parse(data);

    const hash = crypto.createHash("sha256").update(validated.token).digest("hex");

    const user = await User.findOne({
      where: {
        password_reset_token_hash: hash,
        password_reset_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error("Token jest nieprawidłowy lub wygasł.");
    }

    const password_hash = await bcrypt.hash(validated.password, 10);

    await user.update({
      password_hash,
      password_reset_token_hash: null,
      password_reset_expires: null,
    });

    return { message: "Hasło zostało zmienione pomyślnie." };
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
