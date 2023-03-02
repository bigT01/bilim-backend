import {Router} from "express";
import LessonController from "../controllers/LessonController.js";

const router = new Router()

router.post('/course/:id/lesson', LessonController.createLesson)





export default router