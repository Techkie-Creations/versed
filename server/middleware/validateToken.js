import jwt from 'jsonwebtoken'
import { updateAccessToken } from '../helper/tokens.js';

export const validateToken = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ success: false, message: 'Unauthorized Access!'})
    let newToken = accessToken
    const decoded = jwt.decode(refreshToken)
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, async (err, _) => {
        if (err) {
            newToken = updateAccessToken(decoded.id, refreshToken)
            if (!newToken) return res.status(401).json({message: "Unauthorized Access!"})
        }
        else return newToken
    })
    req.info = {
        userId: decoded.id,
        token: newToken
    }
    next()
}