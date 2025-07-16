import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import http from 'http';
import connectDB from "./src/config/connectDB.config.js";

dotenv.config();
const app = express();
const server = http.createServer(app)

app.use(cors());
app.use(express.json());

connectDB()

//routes
import auth_routes from './src/routes/auth.routes.js';
import user_routes from './src/routes/user.routes.js'
import { handle_socket_upgrade } from "./src/sockets/chat_server.js";

app.use('/auth', auth_routes);
app.use('/user', user_routes);

//socket initialization
handle_socket_upgrade(server)

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server runner on http://localhost:${port}`);
});

