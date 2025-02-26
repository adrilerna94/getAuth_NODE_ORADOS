// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body);
      const response = {
        message: `${data?.user.name} successfully logged in`,
        data
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registeredUser = await this.authService.register(req.body);
      const response = {
        message: `${registeredUser?.name} successfully registered`,
        user: {
          id: registeredUser?._id,
          name: registeredUser?.name,
          email: registeredUser?.email,
          password: registeredUser?.password,
        },
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };

}
