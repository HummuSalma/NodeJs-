const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Template
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
// console.log(username)
// console.log(room)

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        'message': message.text,
        'createdAt': moment(message.createdAt).format('h:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render($locationMessageTemplate, {
        'url': message.url,
        'createdAt': moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable using DOM property
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.msg.value
    socket.emit('message', message, (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("Message Delivered!")
    })
})

$locationButton.addEventListener('click', (e) => {
    e.preventDefault()
    //disable the button until the message is received/ delivered
    $locationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Geolocation does not support in your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            //enable the button after the message has been delievered
            $locationButton.removeAttribute('disabled')
            console.log("Location Shared!")
        })
    })
})

socket.emit('join', { username, room })