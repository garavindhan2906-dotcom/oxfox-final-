import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  dbHost: required('DB_HOST', 'localhost'),
  dbPort: Number(process.env.DB_PORT ?? 3306),
  dbUser: required('DB_USER', 'root'),
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbName: required('DB_NAME', 'oxfox_studio'),

  jwtSecret: required('JWT_SECRET', 'dev-only-insecure-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  adminUsername: required('ADMIN_USERNAME', 'Oxfoxstudio.admin'),
  adminPassword: required('ADMIN_PASSWORD', 'Oxfox@password'),

  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
};
