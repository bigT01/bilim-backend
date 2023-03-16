import db from "../db.js";
import { v4 as uuidv4 } from 'uuid';


class StandardController {
    async createStandard(req, res) {
        try {
            const {material, name} = req.body
            const id = uuidv4()
            db.query('insert into standards (id, name, material) values ($1, $2, $3) returning *', [id, name, material])
                .then(response => {
                    res.status(201).json(response.rows[0])
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
    async getStandards(req, res) {
        try{
            db.query('select * from standards')
                .then((response) => {
                    res.status(201).json(response.rows)
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message:'ошибка сервера'})
                })
        } catch (err){
            console.log(err)
            res.status(500).json({message:'ошибка сети'})
        }
    }
    async deleteStandard(req, res) {
        try{
            const {id} = req.params
            db.query('delete from standards where id = $1', [id])
                .then(() => {
                    res.status(201).json({message:'успешно удалено'})
                })
                .catch(err => {
                    console.log(err)
                    res.status(503).json({message:'ошибка сервера'})
                })
        } catch (err){
            console.log(err)
            res.status(500).json({message:'ошибка сети'})
        }
    }
}

export default new StandardController()