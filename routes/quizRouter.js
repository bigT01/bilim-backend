import {Router} from "express";
import QuizController from "../controllers/QuizController.js";

const router = new Router()

router.post('/lesson/:id/quiz', QuizController.createQuiz)
router.get('/quiz/:id', QuizController.getOneQuiz)
router.put('/quiz/:id', QuizController.updateQuiz)
router.delete('/quiz/:id', QuizController.deleteQuiz)
router.get('/lesson/:id/quiz', QuizController.getQuizByLessonId)





export default router