import {Router} from "express";
import MessageController from "../controllers/messageController.js";

const router = new Router()

router.post('/student/:id/message/:id_two', MessageController.createMessage)
router.get('/student/:id/message/:id_two', MessageController.getMessages)


export default router