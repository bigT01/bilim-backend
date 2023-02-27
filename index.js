import * as dotenv from "dotenv";
dotenv.config()
import express from 'express'
import userRouter from "./routes/userRouter.js";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4444


app.use(express.json())
app.use('/api', userRouter)
app.use(cors());

app.get('/', (req, res) => {
    res.send( )
});



app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Server OK ${port}`);
});