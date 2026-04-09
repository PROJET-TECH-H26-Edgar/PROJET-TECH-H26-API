import { AuthRepository } from "../repositories/auth.repository";
import {
  User,
  LoginUserRequest,
  RegisterUserRequest,
} from "../types/types.types";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

const authRepository = new AuthRepository();

export class AuthService {
  async getUserById(id: number): Promise<User | null> {
    return authRepository.findById(id);
  }

  async getUserByMail(mail: string): Promise<User | null> {
    return authRepository.findByMail(mail);
  }

  async createUser(user: RegisterUserRequest): Promise<User> {
    if (await authRepository.findByMail(user.mail)) {
      throw new AppError("User already exists", {
        statusCode: 409,
        code: "USER_ALREADY_EXISTS",
        details: "A user with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    return authRepository.create({
      lastName: user.lastName,
      name: user.name,
      mail: user.mail,
      password: passwordHash,
    });
  }

  async verifyLoginUser(loginCredentials: LoginUserRequest): Promise<User> {
    const user = await authRepository.findByMail(loginCredentials.mail);
    if (!user) {
      throw new AppError("Invalid email or password", {
        statusCode: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        details: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      loginCredentials.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new AppError("Invalid email or password", {
        statusCode: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        details: "Invalid email or password",
      });
    }

    return user;
  }

  async registerUser(
    registerCredentials: RegisterUserRequest,
  ): Promise<string> {
    const user = await this.createUser(registerCredentials);
    return generateToken(user);
  }

  async loginUser(loginCredentials: LoginUserRequest): Promise<string> {
    const user = await this.verifyLoginUser(loginCredentials);
    return generateToken(user);
  }

  isValidPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }
}
