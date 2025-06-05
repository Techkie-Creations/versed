import express from 'express'
import bcrypt from 'bcrypt'
import { upload } from '../middleware/multer.js'

const router = express.Router()

// /api/auth

// /register
router.post('/register', upload.single('avatar'), async (req, res) => {
    const { firstName, lastName, email, username, password, version, book, chapter, verse, defaultAvatar} = req.body

    console.log('Avatar', req.file)
    console.log(firstName, lastName, email, username, password, version, book, chapter, verse, defaultAvatar)

    res.status(200).json({ message: 'Request Received!!'})
})

// Login
router.post('/login', async  (req, res) => {
    console.log(req.body)

    res.status(200).json({ message: 'Login is responding!!!' })
})

export default router