const { Socket } = require('dgram')
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocation} = require('./utils/messages')


const app = express()
const server = http.createServer(app)//express creates the server implicitly .Hence this line not required
const io = socketio(server)//Here, the server value has to be passed to the socketio. Hence we've created the server explicitly

const port = process.env.PORT || 3002
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))


io.on('connection', (socket) => {
    console.log('New WebSocket Connection established!!')

    socket.on('join',({username, room})=>{
        console.log(`username : ${username}, room : ${room}`)
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!!`))    
    })

    socket.on('message', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        io.emit('message',generateMessage (message))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A User has left!'))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

