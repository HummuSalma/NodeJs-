const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json()) // This line is used to convert the json response to object

app.use(cookieParser())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log("Server is running on port " + port)
})

