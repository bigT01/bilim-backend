import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


class UserController {
  async createUser(req, res) {
      try{
          const {login, role, full_name, password, attend} = req.body
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          const id = uuidv4();
          const newPerson = await db.query('insert into student (id ,login, full_name, password, attend, role) values ($1, $2, $3, $4, $5, $6) returning *', [id, login, full_name, hash, attend ,role])
          res.json(newPerson.rows[0])
      } catch (err){
          console.log(err)
          res.status(500).json({message:'ошибка сети'})
      }

  }
  async getUsers(req, res) {
    const role = req.params.role
    const Users = await db.query('select id, full_name, attend, avatar_url from student where role=$1', [role])
    res.json(Users.rows)
  }
  async getOneUser(req, res) {
    try{
      const id = req.params.id;
      let lessonId = []
      let login = ''
      let full_name = ''
      let attend = ''
      db.query('select * from student where id = $1', [id])
          .then(response => {
            login = response.rows[0].login
            full_name = response.rows[0].full_name
            attend = response.rows[0].attend
            db.query('select * from grades where student_id = $1', [id])
                .then(response1 => {
                  lessonId = response1.rows.map(elem => elem.lesson_id)
                    db.query('select ROUND(AVG(grade)::numeric, 0) from grades where student_id = $1', [id])
                        .then(response12 => {
                            db.query('select lesson_id, title from lessons where lesson_id = ANY($1)', [lessonId])
                                .then(response2 => {
                                    const dataWithTitle = response1.rows.map(item => {
                                        const filteredData = response2.rows.filter(elem => item.lesson_id === elem.lesson_id)[0]
                                        return {x:filteredData.title, y:item.grade}
                                    })
                                    res.status(200).json(
                                        {
                                            login: login,
                                            full_name: full_name,
                                            attend: attend,
                                            avg: response12.rows[0].round,
                                            grades: dataWithTitle
                                        }
                                    )
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(503).json({message: 'ошибка с база данной'})
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(503).json({message:'ошибка сервера 1'})
                        })
                })
                .catch(err => {
                  console.log(err)
                  res.status(503).json({message:'ошибка сервера 1'})
                })
          })
          .catch(err => {
            console.log(err)
            res.status(503).json({message:'ошибка сервера'})
          })
    }
    catch (err){
      console.log(err)
      res.status(500).json({message:'ошибка сети'})
    }

  }

  async getUserByClasses(req, res) {
      try{

        db.query('SELECT s.attend, ROUND(AVG(g.grade)::numeric, 0) as average_grade FROM student s JOIN grades g ON s.id = g.student_id GROUP BY s.attend')
            .then(response => {
                res.status(200).json(response.rows)
            })
            .catch(err =>{
                console.log(err)
                res.status(503).json({
                    message: "этот ученик состоит в курсе"
                })
            })
      } catch (err){
          console.log(err)
          res.status(503).json({
              message: "этот ученик состоит в курсе"
          })
      }
  }

  async getUserByAttendOtherUser(req, res) {
        try {
            const {id} = req.params
            const response = await db.query('select * from student where id = $1', [id])
            const attend = response.rows[0].attend.split('-')[0]
            const response1 = await db.query('select id, full_name, attend from student where attend = $1', [attend])
            res.status(200).json(response1.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: "ошибка сервера"
            })
        }
    }

    async getAverageUsersByAttend(req, res) {
        try {
            const {id} = req.params
            const response = await db.query('select * from student where id = $1', [id])
            const attend = response.rows[0].attend.split('-')[0]
            const response1 = await db.query('SELECT ROUND(AVG(g.grade)::numeric, 0) AS avg_score FROM student s JOIN grades g ON s.id = g.student_id WHERE s.attend = $1', [attend])
            res.status(200).json(response1.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: "ошибка сервера"
            })
        }
    }
    async deleteUser(req, res) {
        try {
            const id = req.params.id;

            await db.query('delete from student_courses where student_id = $1', [id]);
            await db.query('delete from grades where student_id = $1', [id]);
            await db.query('delete from message_con where sender = $1 or receives = $1', [id]);
            await db.query('delete from student where id = $1', [id]);

            res.status(201).json({
                message: "успешно удалено"
            });
        } catch (err) {
            if (err.code === '23503') {
                res.status(400).json({
                    message: "этот ученик состоит в курсе"
                });
            } else {
                res.status(500).json({
                    message: "ошибка сервера: " + err.message
                });
            }
        }
    }
}

export default new UserController()