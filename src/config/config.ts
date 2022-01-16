import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_PORT || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 4201;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  username: DB_USER,
  password: DB_PASS
};

const config = { server: SERVER };

export default config;
