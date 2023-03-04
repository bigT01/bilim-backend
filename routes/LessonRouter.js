import {Router} from "express";
import LessonController from "../controllers/LessonController.js";

const router = new Router()

router.post('/course/:id/lesson', LessonController.createLesson)
router.get('/lesson/:id', LessonController.getOneLesson)
router.put('/lesson/:id', LessonController.updateLesson)
router.delete('/lesson/:id', LessonController.deleteLesson)





export default router