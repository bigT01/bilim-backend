import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


class QuizController {
    async createQuiz(req, res) {
        try{
            const lesson_id = req.params.id;
            const id = uuidv4();

            db.query('insert into quiz (quiz_id, lesson_id) values ($1, $2) returning quiz_id', [id, lesson_id])
                .then(response => {
                    res.json(response.rows[0])
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message: 'не удалось создавть квиз'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async updateQuiz(req, res) {
        try{

        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async deleteQuiz(req, res) {
        try{

        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getOneQuiz(req, res) {
        try{

        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
}

export default new QuizController()