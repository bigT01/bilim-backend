import db from "../db.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


class GradeController {
    async getGradesUser(req, res) {
        try{
            const userId = req.params.id
            db.query('select * from grades where student_id = $1', [userId])
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
    async getGradeUserWithLessonName(req, res) {
        try{
            const userId = req.params.id
            let lessonId = []
            db.query('select * from grades where student_id = $1', [userId])
                .then(response => {
                    lessonId = response.rows.map(elem => elem.lesson_id)
                    db.query('select lesson_id, title from lessons where lesson_id = ANY($1)', [lessonId])
                        .then(response2 => {
                            const dataWithTitle = response.rows.map(item => {
                                const filteredData = response2.rows.filter(elem => item.lesson_id === elem.lesson_id)[0]
                                return {...item, title:filteredData.title}
                            })
                            res.status(200).json(dataWithTitle)
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(503).json({message: 'ошибка с база данной'})
                        })
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
    // async getGradesUser(req, res) {
    //     try{
    //         const userId = req.params.id
    //         const
    //         db.query('select * from grades where student_id = $1', [userId])
    //             .then(response => {
    //                 res.status(200).json(response.rows)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.status(503).json({message: 'ошибка с база данной'})
    //             })
    //     }catch(err){
    //         console.log(err)
    //         res.status(500).json({message: 'ошибка сервера'})
    //     }
    // }
}

export default new GradeController()