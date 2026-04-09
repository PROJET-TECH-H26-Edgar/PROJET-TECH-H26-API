import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginUserRequest, RegisterUserRequest } from "../types/types.types";
import { AppError } from "../errors/AppError";

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ((req as any).user) {
        return next(
          new AppError("You are already logged in", {
            statusCode: 403,
            code: "CANNOT_REGISTER_WHEN_LOGGED_IN",
            details:
              "You are already logged in. Please log out before registering",
          }),
        );
      }

      const { lastName, name, mail, password } =
        req.body as RegisterUserRequest;
      const token = await authService.registerUser({
        lastName,
        name,
        mail,
        password,
      });

      res.status(201).json({
        message: "Register successful. You are now logged in.",
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mail, password } = req.body as LoginUserRequest;
      const token = await authService.loginUser({ mail, password });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Logged out" });
  };
}
