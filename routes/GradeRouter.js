import {Router} from "express";
import GradeController from "../controllers/gradeController.js";

const router = new Router()

router.get('/user/:id/grade', GradeController.getGradesUser)
router.get('/user/:id/grade/lessons', GradeController.getGradeUserWithLessonName)


export default router