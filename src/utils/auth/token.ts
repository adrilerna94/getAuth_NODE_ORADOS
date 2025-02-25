import jwt from "jsonwebtoken";
import { IUser } from "../../types/user.interface";
import { AppError } from "../application.error";
import { httpStatus } from "../../config/httpStatusCodes";
import { DecodedToken } from "../../types/decodedToken.interface";

function generateAccessToken (user: IUser) {
    const payLoad = { userEmail: user.email}; // donde almacenan los datos
    const secretKey = process.env.JWT_SECRET_KEY!; // clave privada para firmar el Token
    // ! non-null ➡️ variable nunca sera undefined | null
    const options = {expiresIn: 3600} // opciones: caducidad : 1h
    return jwt.sign(payLoad, secretKey as string, options);
}

function formatJwtTimestamp	(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString("es-ES", { timeZone: "UTC" });
}

function parseJwt(token: string): DecodedToken {
  const decoded = jwt.decode(token) as DecodedToken | null;
  if (!decoded) {
        throw new AppError("Invalid Token", httpStatus.BAD_REQUEST);
  }
  return decoded;
}


export { generateAccessToken, formatJwtTimestamp, parseJwt };
