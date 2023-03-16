import * as dotenv from "dotenv";
dotenv.config()
import express from 'express'
import userRouter from "./routes/userRouter.js";
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import courseRouter from "./routes/courseRouter.js";
import LessonRouter from "./routes/LessonRouter.js";
import quizRouter from "./routes/quizRouter.js";
import questionRouter from "./routes/questionRouter.js";
import LoginRouter from "./routes/LoginRouter.js";
import QuestionRouterForStudent from "./routes/QuestionRouterForStudent.js";
import checkAuth from "./utils/checkAuth.js";
import GradeRouter from "./routes/GradeRouter.js";
import messageRouter from "./routes/messageRouter.js";
import StandardRouter from "./routes/StandardRouter.js";

const app = express();
const port = process.env.PORT || 4444

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json())
app.use('/api', userRouter, courseRouter, LessonRouter, quizRouter, questionRouter, LoginRouter, QuestionRouterForStudent, GradeRouter, messageRouter, StandardRouter)

app.use('/uploads', express.static('uploads'));

app.post('/upload',  upload.single('file'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.get('/', (req, res) => {
    res.send( )
});



app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Server OK ${port}`);
});