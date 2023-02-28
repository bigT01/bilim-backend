import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


class UserController {
  async createUser(req, res) {
    const {login, full_name, password, attend} = req.body
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const newPerson = await db.query('insert into student (id ,login, full_name, password, attend) values ($1, $2, $3, $4, $5) returning *', [id, login, full_name, hash, attend])
    res.json(newPerson.rows[0])
  }
  async getUsers(req, res) {
    const Users = await db.query('select id, full_name, attend, avatar_url from student')
    res.json(Users.rows)
  }
  async getOneUser(req, res) {

  }
  async updateUser(req, res) {

  }
  async deleteUser(req, res) {
    try{
      const id = (req.params.id)
      await db.query('delete from student where id = $1', [id])
      res.status(201).json({
        message:"успешно удално"
      })
    } catch (err){
      if(err.code === '23503'){
        res.status(503).json({
          message: "этот ученик состоит в курсе"
        })
      } else {
        res.status(500).json({
          message: "ошибка сервера"
        })
      }
    }
  }
}

export default new UserController()