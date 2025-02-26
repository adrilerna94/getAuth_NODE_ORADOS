import jwt from "jsonwebtoken";
import { IUser } from "../../types/user.interface";
import { AppError } from "../application.error";
import { httpStatus } from "../../config/httpStatusCodes";
import { DecodedToken } from "../../types/decodedToken.interface";

function generateAccessToken (user: IUser) {
    const payLoad = { userEmail: user.email}; // Los datos que queremos incluir en el token.
    const secretKey = process.env.JWT_SECRET_KEY!; // clave privada para firmar el Token
    // ! non-null ➡️ variable nunca sera undefined | null
    const options = {expiresIn: 3600} // opciones: caducidad : 1h
    return jwt.sign(payLoad, secretKey as string, options);
}

function formatJwtTimestamp	(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString("es-ES", { timeZone: "UTC" });
}

function parseJwt(token: string): DecodedToken {
  // ⚡jwt.decode ➡️ No verifica la firma del token, solo extrae su contenido (payload).
  /*
    ➡️ La conversión as DecodedToken | null indica que el resultado puede ser:
    ➡️ Un objeto con los datos del token  de tipo "DecodedToken"
    ➡️ null si el token es inválido o mal formado.
  */
  const decoded = jwt.decode(token) as DecodedToken | null;
  if (!decoded) {
        throw new AppError("Invalid Token", httpStatus.BAD_REQUEST);
  }
  return decoded;
}
/*
  💡 ¿Cuándo usar jwt.decode?
    ✅ Cuando solo necesitas ver el contenido del token, sin validar si es legítimo.
    ✅ Para debugging o inspeccionar datos sin necesidad de una clave secreta.
    ✅ Si confías en la fuente del token y solo necesitas extraer información rápidamente.

*/

export { generateAccessToken, formatJwtTimestamp, parseJwt };
