import db from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import {response} from "express";


class LessonController {
    async createLesson(req, res) {
        try{
            const course_id = req.params.id
            const id = uuidv4();
            const {title, preview_image, description, material, start_time, end_time} = req.body

            await db.query('insert into lessons (lesson_id, course_id, title, preview_image, description, material, start_time, end_time) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *', [id, course_id, title, preview_image, description, material, start_time, end_time])
                .then(response => {
                    res.status(201).json(response.rows[0])
                })
                .catch(err =>{
                    console.log(err)
                    res.status(500).json({message: 'ошибка сервера попробуйте позднее'})
                })
        } catch (err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getOneLesson(req, res) {
        try{
            const lesson_id = req.params.id
            db.query('select * from lessons where lesson_id = $1', [lesson_id])
                .then(response => {
                    res.status(200).json(response.rows[0])
                })
                .catch(err =>{
                    console.log(err)
                    res.status(503).json({message: 'не смогли найти этот урок попробуйте поднее'})
                })
        } catch (err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async getLessonsForStudentByCourseId(req, res) {
        try{
            const course_id = (req.params.id)
            const data = await db.query('select lesson_id, title, preview_image, start_time, end_time from lessons where course_id = $1', [course_id])
            res.json(data.rows)
        }catch (err){
            console.log(err)
            res.status(500).json({
                message: 'ошибка сервера'
            })
        }
    }
    async updateLesson(req, res) {
        try{
            const lesson_id = req.params.id
            const {title, preview_image, description, material, start_time, end_time} = req.body
            db.query('update lessons set title = $1, preview_image = $2, description = $3, material=$4, start_time=$5, end_time=$6 where lesson_id=$7', [title, preview_image, description, material, start_time, end_time, lesson_id])
                .then(response => {
                    res.status(200).json({message:'урок был обновлено'})
                })
                .catch(err =>{
                    console.log(err)
                    res.status(503).json({message: 'не смогли найти этот урок попробуйте поднее'})
                })
        } catch (err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
    async deleteLesson(req, res) {
        try{
            const lesson_id = req.params.id
            db.query('select * from quiz where lesson_id = $1', [lesson_id])
                .then(response => {
                    const quiz_id = (response.rows[0]?.quiz_id)
                    db.query('delete from question where quiz_id = $1', [quiz_id])
                        .then(() => {
                            db.query('delete from quiz where quiz_id = $1', [quiz_id])
                                .then(() => {
                                    db.query('delete from lessons where lesson_id = $1', [lesson_id])
                                        .then(() =>{
                                            res.json({message:'успешно удалено'})
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            res.status(500).json({message: 'ошибка урока'})
                                        })
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.json({
                                        message: 'ошибка квиза'
                                    })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({message: 'ошибка вопроса'})
                        })
                })
                .catch(err =>{
                    console.log(err)
                    res.status(503).json({message:'ошибка сервера'})
                })
        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
}

export default new LessonController()