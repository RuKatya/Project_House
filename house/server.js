const express = require('express')
const app = express(); ///server;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(express.static('public'));
app.use(bodyParser.json())

const users = [{ name: "Shneor", password: "123", role: "admin", assignRoom: "assignRoom1" },
    { name: "Dudi", password: "456", role: "child", assignRoom: "assignRoom1" },
    { name: "Lior", password: "789", role: "child", assignRoom: "assignRoom1" },
    { name: "Katya", password: "159", role: "guest", assignRoom: "assignRoom1" }
]

app.post('/login', (req, res) => {
    const { username, password } = req.body; //getting the value in server

    console.log(username, password) //for check

    res.send({ login: 'in' })
})

app.post('/weather', (req, res) => {
    const { city } = req.body;

    console.log(city)

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=84dda819f36a2f81e3babdb748579c85`)
        .then(r => r.json())
        .then(weather => {
            res.send({ ok: true, weather })
        })
})

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`RUNNING: ${PORT}`)
})