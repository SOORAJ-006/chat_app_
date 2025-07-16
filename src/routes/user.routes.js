import express from 'express';
import { createGroupConversation, createPrivateConversation, getMessages } from '../controller/conversation.controller.js';
import { verify_token } from '../middleware/token_validation.midlleware.js';
const router = express.Router();

router.route('/conversation/private').post(verify_token, createPrivateConversation);
router.route('/conversation/group').post(verify_token, createGroupConversation);
router.route('/chat-history').get(verify_token, getMessages);


export default router