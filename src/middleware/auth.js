const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','') 
        console.log('token :' +token)
        const decoded = jwt.verify(token,'thisismysecretkey')
        console.log('decoded :' +decoded._id)
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token})
        console.log(user)
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        console.log(e)
        res.status(401).send({error : "Unauthorized user"})
    }
    
}

module.exports = auth