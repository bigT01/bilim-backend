import db from "../db.js";
import {v4 as uuidv4} from "uuid";


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
            const resData = []
            db.query('select * from question where quiz_id = $1', [quiz_id])
                .then(response => {
                    response.rows.map(data => {
                        if(data?.type.trim() === 'checkbox'){
                            const options = JSON.parse(data.options)
                            resData.push({
                                question_id: data.question_id,
                                question: data.question,
                                type: data.type.trim(),
                                options: options,
                                photo: data.photo
                            })
                        }
                        if(data?.type.trim() === 'multiple'){
                            const options = JSON.parse(data.options)
                            resData.push({
                                question_id: data.question_id,
                                question: data.question,
                                type: data.type.trim(),
                                options: options,
                                photo: data.photo
                            })
                        }
                        if(data?.type.trim() === 'drop'){
                            const options1 = JSON.parse(data.options)
                            const options = options1.map(item => {
                                return item.variant
                            } )
                            resData.push({
                                question_id: data.question_id,
                                question: data.question,
                                type: data.type.trim(),
                                options: options,
                                photo: data.photo
                            })
                        }
                        if(data?.type.trim() === 'select'){
                            const options1 = JSON.parse(data.options)
                            const options = options1.map(item => {
                                return {value: item.value, question: item.question}
                            } )
                            const variants = options1.map(item => item.variant)
                            for (let i = variants.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [variants[i], variants[j]] = [variants[j], variants[i]];
                            }
                            resData.push({
                                question_id: data.question_id,
                                question: data.question,
                                type: data.type.trim(),
                                options: options,
                                variants: variants,
                                photo: data.photo
                            })
                        }
                    })

                    res.status(200).json(resData)
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
    async CheckQuestionsAnswer(req, res) {
        try{
            const userId = req.params.id
            const lessonId = req.params.lessonId
            const id = uuidv4();
            const quiz_id = req.params.quizId
            const {answer} = req.body
            const Result = []
            db.query('select * from question where quiz_id = $1', [quiz_id])
                .then(response => {
                    let corr = 0
                    response.rows.map((items) => {

                        if(items.type.trim() === 'checkbox') {
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    if (ans.value.toString().trim() === items.correct_answer.toString().trim()) {
                                        Result.push({question_id: items.question_id, isCorrect: true})
                                        corr += 1
                                    } else {
                                        Result.push({question_id: items.question_id, isCorrect: false})
                                    }
                                }
                            })
                        }
                        if(items.type.trim() === 'multiple'){
                            const answerChecker =  JSON.parse(items.correct_answer.trim())
                            let counter = 0
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    ans.value.map(elem => {
                                        answerChecker.map(elem2 => {
                                            if(elem2.toString().trim() === elem.toString().trim()){
                                                counter += 1
                                            }
                                        })
                                    })
                                }
                            })
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    if (counter === answerChecker.length) {
                                        Result.push({question_id: items.question_id, isCorrect: true})
                                        corr += 1
                                    } else {
                                        Result.push({question_id: items.question_id, isCorrect: false})
                                    }
                                }
                            })
                        }
                        if(items.type.trim() === 'drop'){
                            const answerChecker =  JSON.parse(items.options.trim())
                            let correct_ans = 0;
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    ans.value.map(item => answerChecker.map(elem => {
                                        if(elem.variant.trim() === item.value.trim() && elem.value.toString().trim() === item.id.toString().trim()){
                                            correct_ans += 1
                                        }
                                    }))
                                }
                            })
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    if(correct_ans < parseInt(JSON.parse(items.correct_answer.trim()))){
                                        Result.push({question_id: items.question_id, isCorrect: true})
                                        corr += 1
                                    } else {
                                        Result.push({question_id: items.question_id, isCorrect: false})
                                    }
                                }
                            })
                        }
                        if(items.type.trim() === 'select'){
                            const answerChecker =  JSON.parse(items.options.trim())
                            let correct_ans = 0;
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    ans.value.map(item1 => {
                                        answerChecker.map(item2 => {
                                            if(item1?.id === item2.value){
                                                if(item1?.value === item2.variant){
                                                    correct_ans += 1
                                                }
                                            }
                                        })
                                    })
                                }
                            })
                            answer.map(ans => {
                                if (ans.id === items.question_id) {
                                    if(correct_ans === answerChecker.length){
                                        Result.push({question_id: items.question_id, isCorrect: true})
                                        corr += 1
                                    } else {
                                        Result.push({question_id: items.question_id, isCorrect: false})
                                    }
                                }
                            })
                        }
                    })
                    db.query('INSERT INTO grades (id, student_id, lesson_id, grade) values ($1, $2, $3, $4)', [id, userId, lessonId, corr * 100 / Result.length])
                        .then(() => {
                            res.status(200).json({
                                Result,
                                total_point: corr * 100 / Result.length
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({message: 'ошибка сервера'})
                        })
                })
                .catch(err =>{
                    console.log(err)
                    res.status(500).json({message: 'ошибка сервера'})
                })

        }catch(err){
            console.log(err)
            res.status(500).json({message: 'ошибка сервера'})
        }
    }
}

export default new QuestionControllerForStudent()