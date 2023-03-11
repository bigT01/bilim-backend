import {Router} from "express";
import QuestionControllerForStudent from "../controllers/questionControllerForStudent.js";

const router = new Router()

router.get('/quiz/:id/question/', QuestionControllerForStudent.getQuestionsIdByQuizId)
router.get('/questionStudent/:id', QuestionControllerForStudent.getOneQuestion)








export default router