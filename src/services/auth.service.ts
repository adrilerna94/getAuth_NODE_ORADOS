// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/application.error';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/auth/hash';
import { formatJwtTimestamp, generateAccessToken, parseJwt } from '../utils/auth/token';
import { IUserDto } from '../types/userDto.interface';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  register = async (userData: IUserDto) => {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already registered. Please Log in', 409); // ❌ Conflict
    }
    const hashedPassword = await hashPassword(userData);
    const newUser: IUserDto = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    };
    return this.userRepository.register(newUser);
  }

  login = async (userData: IUserDto) => {
    const user = await this.userRepository.findByEmail(userData.email);
    if (!user){
        throw new AppError('User not Found. Please Register', httpStatus.NOTFOUND);
    }

    // Check hashedPassword in DB with UserPassword
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid Credentials', httpStatus.UNAUTHORIZED);
    }

    // Generate JWT Token
    const accessToken = generateAccessToken(userData);

    // Decodificar el accessToken con seguridad
    const decodedAccessToken = parseJwt(accessToken);

    // Formatear fechas
    const formattedAccessToken = {
      token: accessToken,
      issuedAt: formatJwtTimestamp(decodedAccessToken.iat),
      expiresAt: formatJwtTimestamp(decodedAccessToken.exp)
    };

    return {
        accessToken: formattedAccessToken,
        user: {
            id: user._id as string,
            email: user.email,
            name: user.name
        }
    };
};

}
