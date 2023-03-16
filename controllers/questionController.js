import db from "../db.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


class QuestionController {
    async createQuestion(req, res) {
        try{
            const quiz_id = req.params.id;
            const id = uuidv4();

            await db.query('insert into question (question_id, quiz_id) values ($1, $2) returning question_id', [id, quiz_id])
                .then(response => {
                    res.json(response.rows[0])
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message: 'не удалось создавть вопрос'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async updateQuestion(req, res) {
        try{
            const question_id = req.params.id;
            const {question, type, options, correct_answer, photo} = req.body
            const now = new Date();
            const time = now.toISOString();

            db.query('update question set question = $1, type = $2, options = $3, correct_answer=$4, updated_at=$5, photo=$6 where question_id=$7', [question.trim(), type.trim(), options.trim(), correct_answer.trim(), time, photo, question_id])
                .then(response => {
                    res.status(200).json({message:'вопрос было успешно обновлено'})
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message: 'ошибка с база данной'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async deleteQuestion(req, res) {
        try{
            const question_id = req.params.id
            db.query('delete from question where question_id = $1', [question_id])
                .then(() => {
                    res.status(200).json({message: 'вопрос успешно удалено'})
                })
                .catch((err) => {
                    console.log(err)
                    res.status(503).json({message: 'ошибка сервера попробуйте позднее'})
                })

        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getOneQuestion(req, res) {
        try{
            const question_id = req.params.id;
            db.query('select * from question where question_id = $1', [question_id])
                .then(response => {
                    res.status(200).json(response.rows[0])
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message: 'ошибка с база данной'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getQuestions(req, res) {
        try{
            const quiz_id = req.params.id;
            db.query('select * from question where quiz_id = $1', [quiz_id])
                .then(response => {
                    res.status(200).json(response.rows)
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message: 'ошибка с база данной'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
}

export default new QuestionController()