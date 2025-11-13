import jwt from 'jsonwebtoken';
import config from './env.js';

export const generateToken = (payload, customExpiresIn) => {

  const expiresIn = customExpiresIn || config.jwt.expiresIn;
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateToken,
  verifyToken,
  decodeToken
};