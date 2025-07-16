import { WebSocketServer } from "ws";
import { verify_socket_token } from "./middleware/socket_token_validation.midlleware.js";
import { onSocketPreError , onSocketPostError} from './helpers/ws_error_handler.helpers.js'
import { handle_socket_connect } from "./controller/chat_socket.controller.js";

export const wss = new WebSocketServer({ noServer: true });

export const handle_socket_upgrade = (server) => {
  server.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);
  

    const payload = verify_socket_token(req, socket)

    if(!payload) return;
    req.user = payload;

    wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  handle_socket_connect(ws, req, wss)
});
}
