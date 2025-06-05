import User from "../models/UserModel.js";

export const validation = async (email, schema) => {
    try {
        const userExists = await User.findOne({email: email}, 'firstName lastName password avatar')
        if (schema === 'login') {
            if (userExists) return userExists
            return false
        }
        if (schema === 'signup') {
            if (userExists) return true
            return false
        }
        return 'Unknown Schema!!'
    } catch (err) {
        console.error('Server Error....', err.message)
        return undefined
    }
}