import { User } from '../models'
import bcrypt from 'bcrypt';
import { UserCreationAttributes, UserUpdateAttributes } from '../dto/user';
import { createUserSchema, updateUserSchema} from '../validation/user';


export class UserService {
  static async getAllUsers() {
    return User.findAll();
  }

  static async getUserById(id: string) {
    return User.findByPk(id);
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
}
