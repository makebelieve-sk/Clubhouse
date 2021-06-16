import jwt from "jsonwebtoken";
import {UserData} from "../../pages";

export const createJwToken = (user: UserData): string => {
    const token = jwt.sign(
        {
            data: user
        },
        process.env.SECRET_KEY_JWT || "",
        {
            expiresIn: process.env.JWT_MAX_AGE,
            algorithm: "HS256",
        }
    );

    return token;
};