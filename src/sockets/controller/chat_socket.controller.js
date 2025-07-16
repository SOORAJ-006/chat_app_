import { WebSocket } from "ws";
import { onSocketPostError } from "../helpers/ws_error_handler.helpers.js";
import Message from "../../models/message.models.js";
import Conversation from "../../models/conversation.models.js";

export const handle_socket_connect = (ws, req, wss) => {
  ws.on("error", onSocketPostError);

  ws.userId = req.user.id;
  console.log(ws.userId);

  ws.on("message", async (response, isBinary) => {
    const data = JSON.parse(response.toString());

    const existingConversation = await Conversation.findById(
      data.conversationId
    );
    if (!existingConversation)
      return ws.send(JSON.stringify("conversation doesn't exist"));

    const createMessage = await Message.create({
      conversationId: data.conversationId,
      senderId: ws.userId,
      content: data.message,
      type: data.type,
    });

    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN && (client.userId === existingConversation.participants)) {
    //     console.log("send");
    //     client.send(JSON.stringify(data), { binary: isBinary });
    //   }
    // });

    wss.clients.forEach((client) => {
      if (client.readyState !== WebSocket.OPEN) return;

      const participantIds = existingConversation.participants.map((p) =>
        typeof p === "string" ? p : p.toString()
      );

      if (participantIds.includes(client.userId)) {
        console.log(" Sending to:", client.userId);
        client.send(JSON.stringify(data), { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("connection closed");
  });

  ws.on("error", (err) => {
    onSocketPostError(err);
  });
};
