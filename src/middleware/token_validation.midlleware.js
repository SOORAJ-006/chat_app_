import jwt from 'jsonwebtoken';
import { handle_response } from '../utils/centralized_response_handler.utils.js';
import { HttpStatusCodes } from '../constant.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const verify_token = (req, res, next) => {
  const auth_header = req.headers['authorization'];

  if(!auth_header || !auth_header.startsWith("Bearer ")) 
    return handle_response(res, HttpStatusCodes.UNAUTHORIZED, "Access token is missing");
  

  const token = auth_header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return handle_response(res, HttpStatusCodes.UNAUTHORIZED, 'Invalid or expired token')
  }
}