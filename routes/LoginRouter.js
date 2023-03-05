import {Router} from "express";
import LoginController from "../controllers/LoginController.js";
import checkAuth from "../utils/checkAuth.js";

const router = new Router()

router.post('/login', LoginController.getUser)
router.get('/auth/me', checkAuth, LoginController.getMe)




export default router