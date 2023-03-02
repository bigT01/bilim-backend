import {Router} from "express";
import QuestionController from "../controllers/questionController.js";

const router = new Router()

router.post('/quiz/:id/question', QuestionController.createQuestion)
router.get('/question/:id', QuestionController.getOneQuestion)
router.put('/question/:id', QuestionController.updateQuestion)
router.delete('/question/:id', QuestionController.deleteQuestion)





export default router