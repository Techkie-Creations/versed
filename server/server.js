import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './api/auth.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8000

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['set-cookie']
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})