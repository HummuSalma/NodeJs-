const jwt = require('jsonwebtoken')
const User = require('../models/user')
const cookieParser = require('cookie-parser')

const auth = async (req, res, next) => {
    try {
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies.token
        if(!token){
            throw new Error("Token Not Found")
        }
        console.log('token :' +token)
        const decoded = jwt.verify(token, 'thisismysecretkey')
        console.log('decoded :' +decoded._id)
        // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const user = await User.findOne({_id : decoded._id})
        if (!user) {
            throw new Error("Unauthorized User")
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send({ error: e.message })
    }

}

module.exports = auth