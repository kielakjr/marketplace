import { Product, User } from '../models'
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserCreationAttributes, UserUpdateAttributes, UserFilters } from '../dto/user';
import { createUserSchema, updateUserSchema} from '../validation/user';


export class UserService {
  static async getAllUsers(filters?: Partial<UserFilters>) {
  const where: any = {};

  if (filters?.username) {
    where.username = { [Op.like]: `%${filters.username}%` };
  }

  if (filters?.email) {
    where.email = { [Op.like]: `%${filters.email}%` };
  }

  const sortBy = filters?.sortBy ?? 'createdAt';
  const sortOrder = filters?.sortOrder ?? 'asc';
  const limit = filters?.limit ?? 20;
  const page = filters?.page ?? 1;
  const offset = (page - 1) * limit;

  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  static async getUserById(id: string) {
    return User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Product,
        as: 'products',
      }],
    });
  }

  static async createUser(data: UserCreationAttributes) {
    const validatedData = createUserSchema.parse(data);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    return User.create({ ...validatedData, password: hashedPassword });
  }

  static async updateUser(id: string, data: UserUpdateAttributes) {
    const validatedData = updateUserSchema.parse(data);
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.update(validatedData);
  }

  static async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.destroy();
  }

  static async toggleRole(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    return user.update({ role: newRole });
  }
}
