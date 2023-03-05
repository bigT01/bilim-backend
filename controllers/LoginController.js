import db from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


class LoginController {
    async getUser(req, res) {
        try {
            const { login, password } = req.body;
            const user = await db.query('SELECT * FROM student WHERE login = $1', [login]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: 'User not found' });
            }

            const match = await bcrypt.compare(password, user.rows[0].password);

            if (match) {
                const token = jwt.sign(
                    {
                        id: user.rows[0].id,
                    },
                    'secret123',
                    {
                        expiresIn: '30d',
                    },
                    )
                db.query('update student set token = $1 where id = $2', [token, user.rows[0].id])
                    .then(() => {
                        db.query('select * from student where id = $1', [user.rows[0].id])
                            .then(response => {
                                return res.json(response.rows[0]);
                            })
                            .catch(err => {
                                console.log(err)
                                return res.status(401).json({ message: 'Incorrect password' });
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(401).json({ message: 'Incorrect password' });
                    })

            } else {
                return res.status(401).json({ message: 'Incorrect password' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
    async getMe(req,res) {
        try {
            const user = await db.query('select * from student where id = $1', [req.userId]);

            if (user.rows.length === 0) {
                return res.status(404).json({
                    message: 'Пользователь не найден',
                });
            }
            res.status(200).json(user.rows[0]);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Нет доступа',
            });
        }
    }
}

export default new LoginController()