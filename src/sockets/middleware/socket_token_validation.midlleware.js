import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

export const verify_socket_token = (req, socket) => {
  const auth_header = req.headers['authorization'];

  if(!auth_header || !auth_header.startsWith('Bearer ')){
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return null;
  }

  let token = auth_header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("WebSocket token verification failed:", err.message);
    socket.write('');
    socket.destroy();
    return null
  }
  
}