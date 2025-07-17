import { WebSocket } from "ws";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { online_users } from "../sockets/chat_server.js";
import { handle_response } from "../utils/centralized_response_handler.utils.js";

export const createPrivateConversation = async (req, res, next) => {
  try {
    const userId1 = req.user.id
    const {  userId2 } = req.body;

    if (!userId1 || !userId2 || userId1 === userId2)
      return handle_response(res, 400, "Invalid user IDs.");

    // Check if already exists
    const existing = await Conversation.findOne({
      type: "private",
      participants: { $all: [userId1, userId2], $size: 2 },
    });

    if (existing)
      return handle_response(res, 200, "Conversation already exists", existing);

    const newConversation = await Conversation.create({
      type: "private",
      participants: [userId1, userId2],
    });

    const client = online_users.get(userId2);
    console.log("client : " , client);
    
    if(client && client.readyState === WebSocket.OPEN) {

      try {
        client.send(JSON.stringify({
          type: "conversation:new",
          newConversation: newConversation.toObject()
        }));
      } catch (sendErr) {
        console.error(" Failed to notify user over WebSocket:", sendErr.message);
      }
    }

    handle_response(res, 201, "Conversation created", newConversation);
  } catch (err) {
    next(err);
  }
};


export const createGroupConversation = async (req, res, next) => {
  try {
    const { name, participantIds } = req.body;

    if (!name || !participantIds || participantIds.length < 1)
      return handle_response(res, 400, "Invalid group details.");

    const group = await Conversation.create({
      type: "group",
      name,
      participants: [...participantIds, req.user.id],
      admins: [req.user.id],
      createdBy: req.user.id
    });

    handle_response(res, 201, "Group conversation created", group);
  } catch (err) {
    next(err);
  }
};


export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    handle_response(res, 200, "Messages fetched", messages);
  } catch (err) {
    next(err);
  }
};







