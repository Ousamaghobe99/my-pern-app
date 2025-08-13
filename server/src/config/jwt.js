import jwt from 'jsonwebtoken';
import config from './env.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateToken,
  verifyToken,
  decodeToken
};

