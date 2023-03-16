import db from "../db.js";
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
            const quiz_id = req.params.id
            const {title, duration, total_points, is_active} = req.body
            const now = new Date();
            const time = now.toISOString();

            db.query('update quiz set title = $1, duration = $2, total_points = $3, is_active=$4, updated_at=$5 where quiz_id=$6', [title, duration, total_points, is_active, time, quiz_id])
                .then(response => {
                    res.status(200).json({message: 'квиз было обновлено'})
                })
                .catch(err =>{
                    console.log(err)
                    res.status(503).json({message: 'ошибка сервера'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async deleteQuiz(req, res) {
        try{
            const quiz_id = req.params.id
            db.query('delete from question where quiz_id = $1', [quiz_id])
                .then(() => {
                    db.query('delete from quiz where quiz_id = $1', [quiz_id])
                        .then(() => {
                            res.json({message: 'успешно удалено'})
                        })
                        .catch(err => {
                            console.log(err)
                            res.json({
                                message: 'ошибка сервера'
                            })
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({message: 'ошибка сервера'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getOneQuiz(req, res) {
        try{
            const quiz_id = req.params.id
            db.query('select * from quiz where quiz_id = $1', [quiz_id])
                .then(response => {
                    res.status(200).json(
                        response.rows[0]
                    )
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getQuizByLessonId(req, res) {
        try{
            const lesson_id = req.params.id;

            db.query('select quiz_id from quiz where lesson_id = $1', [lesson_id])
                .then(response => {
                    res.status(200).json(response.rows[0])
                })
                .catch(err => {
                    console.log(err)
                    res.status(200).json({message: 'ошибка сервера'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
}

export default new QuizController()