/* Using material from Rob Hess' CS 290 course 
and https://blog.arnabghosh.me/bypass-cors-error */

const express = require('express')
const app = express()
const cors = require('cors')
var port = 2000

app.use(cors())

function generateEasyNumber() {
    num = Math.floor(Math.random() * 11)
    return num.toString()
}

function generateMedNumber() {
    num = Math.floor(Math.random() * (99 - 10 + 1) + 10)
    return num.toString()
}

function generateHardNumber() {
    num = Math.floor(Math.random() * (999 - 100 + 1) + 100)
    return num.toString()
}


app.get('/', (req, res) => {
    var text = "Random number generator!"
    res.send(text)
})

app.get('/easy', (req, res) => {
    var text = generateEasyNumber()
    res.send(text)
})

app.get('/medium', (req, res) => {
    var text = generateMedNumber()
    res.send(text)
})

app.get('/hard', (req, res) => {
    var text = generateHardNumber()
    res.send(text)
})

app.listen(port, function () {
    console.log("== Server is listening on port:", port)
})