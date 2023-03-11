import db from "../db.js";


class QuestionControllerForStudent {
    async getOneQuestion(req, res) {
        try{
            const question_id = req.params.id;
            db.query('select * from question where question_id = $1', [question_id])
                .then(response => {
                    if(response.rows[0].type.trim() === 'checkbox'){
                        const options = JSON.parse(response.rows[0].options)

                        res.status(200).json({
                            question_id: response.rows[0].question_id,
                            question: response.rows[0].question,
                            type: response.rows[0].type.trim(),
                            options: options,
                            photo: response.rows[0]?.photo
                        })
                    }
                    else{
                        res.status(200).json(response.rows[0])
                    }
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
    async getQuestionsIdByQuizId(req, res) {
        try{
            const quiz_id = req.params.id;
            db.query('select question_id from question where quiz_id = $1', [quiz_id])
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
    async getQuestions(req, res) {
        try{
            const quiz_id = req.params.id;
            db.query('select * from question where quiz_id = $1', [quiz_id])
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
}

export default new QuestionControllerForStudent()