import db from "../db.js";
import { v4 as uuidv4 } from 'uuid';


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

}

export default new LessonController()