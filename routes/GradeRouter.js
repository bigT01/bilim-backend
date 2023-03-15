import {Router} from "express";
import GradeController from "../controllers/GradeController.js";

const router = new Router()

router.get('/user/:id/grade', GradeController.getGradesUser)
router.get('/user/:id/grade/lessons', GradeController.getGradeUserWithLessonName)


export default router