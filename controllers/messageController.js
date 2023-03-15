import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {response} from "express";


class MessageController {
    async createMessage(req, res) {
        try {
            const {id, id_two} = req.params
            const {message_content} = req.body
            const id_message = uuidv4();

            db.query('insert into message_con (id, sender_id, reciever_id, message_content) values ($1, $2, $3, $4)', [id_message, id, id_two, message_content])
                .then(() => {
                    res.status(200).json({
                        message:'отправлено'
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({
                        message:'не удалось отправить'
                    })
                })
        }
        catch (err){
            console.log(err)
            res.status(500).json({
                message:'не отправилось'
            })
        }
    }
    async getMessages(req, res) {
        try{
            const {id, id_two} = req.params
            db.query('select * from message_con where sender = $1 and receives = $2', [id, id_two])
                .then(response => {
                    res.status(200).json(response.rows)
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({
                        message:'не удалось получить сообщения'
                    })
                })
        } catch (err){
            console.log(err)
            res.status(500).json({
                message:'ошибка сети'
            })
        }
    }
    async getOneMessage(req, res) {

    }
}

export default new MessageController()