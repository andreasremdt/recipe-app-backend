import dotenv from "dotenv";

dotenv.config();

export default {
  port: parseInt(process.env.PORT!, 10),
  jwtSecret: process.env.JWT_SECRET!,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS!, 10),
};
