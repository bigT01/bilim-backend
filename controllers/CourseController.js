import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


class CourseController {
    async createCourse(req, res) {
        const {name, description} = req.body;
        const id = uuidv4();

        const newCourse = await db.query('insert into course (id , name, description) values ($1, $2, $3) returning *', [id, name, description])

        res.json(newCourse.rows[0])
    }
    async getCourses(req, res) {
        const data = await db.query('SELECT course.id, course.name, COUNT(DISTINCT student_courses.student_id) AS num_students, COUNT(DISTINCT lessons.lesson_id) AS num_lessons FROM course LEFT JOIN student_courses ON course.id = student_courses.course_id LEFT JOIN lessons ON course.id = lessons.course_id GROUP BY course.name, course.id')
        res.json(data.rows)
    }
    async getOneCourse(req, res) {
        try{
            const id = (req.params.id)
            const data = await db.query('select lesson_id, title, preview_image from lessons where course_id = $1', [id])
            res.json(data.rows)
        }catch (err){
            console.log(err)
            res.status(500).json({
                message: 'ошибка сервера'
            })
        }
    }
    async updateCourse(req, res) {

    }
    async deleteCourse(req, res) {
        try{
            const id = (req.params.id)
            db.query('delete from lessons where course_id = $1', [id])
                .then(() => {
                    db.query('delete from student_courses where course_id = $1', [id])
                        .then(() =>{
                            return (db.query('delete from course where id = $1', [id]))
                        })
                        .then(() => {
                            res.status(201).json({
                                message:"успешно удално"
                            })
                        })
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({message: 'ошибка сервера'});
                });
        } catch (err){
            if(err.code === '23503'){
                console.log(err);
                res.status(503).json({
                    message: "у этого курса есть уроки"
                })
            } else {
                res.status(500).json({
                    message: "ошибка сервера"
                })
            }
        }
    }
    async updateUsersCourse(req, res) {
        const id = req.params.id
        const {students} = req.body
        db.query('select student_id from student_courses where course_id = $1 ;', [id])
            .then(users => {
                const studentsIdFromDB = users.rows.map(item => item.student_id)

                const StudentsToAdd = students.filter(studentID => !studentsIdFromDB.includes(studentID))
                const StudentsToRemove = studentsIdFromDB.filter(studentID => !students.includes(studentID))

                Promise.all(StudentsToAdd.map((student) => {
                    db.query('INSERT INTO student_courses (student_id, course_id) VALUES ($1, $2);', [student, id])
                }))
                    .then(() => {
                        return Promise.all(StudentsToRemove.map((student) => db.query('DELETE FROM student_courses WHERE student_id = $1;', [student])))
                    })
                    .then(() => {
                        res.json({message: 'список студентов было обновлено'});
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({message: 'ошибка при обновления студенов'});
                    });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({message: 'ошибка сервера'});
            });
    }
    async getUsersCourse(req, res) {
        const id = req.params.id
        await db.query('SELECT student_id FROM student_courses WHERE course_id = $1  ', [id])
            .then((result) => {
                res.json(result.rows);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({message: 'не могли найти студенов этого курса'});
            });
    }
}

export default new CourseController()