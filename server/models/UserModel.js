import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true
}

const UserSchema = new mongoose.Schema({
    firstName: reqString,
    lastName: reqString,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: reqString,
    avatar: reqString,
    favVerse: reqString,
    verseEncoded: reqString
}, {
    timestamps: true
}
)

const userDB = mongoose.connection.useDb('users');
const User = userDB.model("User", UserSchema)

export default User