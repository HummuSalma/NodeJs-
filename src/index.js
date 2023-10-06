const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send("Get request are restricted")
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send("Site is under Maintenance")
// })

app.use(express.json()) // This line is used to convert the json response to object
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log("Server is running on port " + port)
})

// const bcrypt = require('bcryptjs')

// const hashPassword = async ()=>{
//     const password = 'salma'
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log(password) 
//     console.log(hashedPassword)
    
//     //To compare the plain text with hashed password
//     const compare = await bcrypt.compare(password,hashedPassword)
//     console.log(compare)
// }

// hashPassword()

// //Generating Jwt Token
// const jwt = require('jsonwebtoken')

// const jwtToken = async()=>{
//     const token = await jwt.sign({ "_id" : "abc123"},'Thisismysecretkey',{ expiresIn : '7 days'})
//     console.log(token)
//     const data = jwt.verify(token,'Thisismysecretkey')
//     console.log(data)
// }
// jwtToken()