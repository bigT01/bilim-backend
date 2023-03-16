import {Router} from "express";
import userController from "../controllers/UserController.js";

const router = new Router()

router.post('/user', userController.createUser)
router.get('/user/:role', userController.getUsers)
router.get('/attends/:id', userController.getUserByAttendOtherUser)
router.get('/average/:id', userController.getAverageUsersByAttend)
router.get('/statistic/user', userController.getUserByClasses)
router.get('/userOne/:id', userController.getOneUser)
router.delete('/user/:id', userController.deleteUser)



export default router