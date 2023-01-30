declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_SECRET: string;
      BCRYPT_ROUNDS: string;
    }
  }
}

export {};
