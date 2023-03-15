import {Router} from "express";
import QuestionControllerForStudent from "../controllers/questionControllerForStudent.js";

const router = new Router()

router.get('/quiz/:id/question/', QuestionControllerForStudent.getQuestionsIdByQuizId)
router.get('/questionStudent/:id', QuestionControllerForStudent.getOneQuestion)
router.post('/user/:id/lesson/:lessonId/quiz/:quizId/question/answer', QuestionControllerForStudent.CheckQuestionsAnswer)









export default router