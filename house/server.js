const express = require('express')
const app = express(); ///server;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(express.static('public'));
app.use(bodyParser.json())


const mongoose = require('mongoose'); //npm i mongoose
const url = 'mongodb+srv://KatyaRu:qHO9SxoCGZc6lv7C@cluster0.mfqlq.mongodb.net/test'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); //connectin to the db

const user = mongoose.model('user', { //collection
    name: String, //with big letter !!!
    password: Number,
    role: String,
    assignRoom: String
});

const Shneor = new user({ name: "Shneor", password: "123", role: "admin", assignRoom: "assignRoom1" })
    // Shneor.save().then(doc => console.log(doc)).catch(e => {
    //     console.log(e)
    // })

const Dudi = new user({ name: "Dudi", password: "456", role: "child", assignRoom: "assignRoom1" })
    // Dudi.save().then(doc => console.log(doc)).catch(e => {
    //     console.log(e)
    // })

const Lior = new user({ name: "Lior", password: "789", role: "child", assignRoom: "assignRoom1" })
    // Lior.save().then(doc => console.log(doc)).catch(e => {
    //     console.log(e)
    // })

const Katya = new user({ name: "Katya", password: "159", role: "guest", assignRoom: "assignRoom1" })
    // Katya.save().then(doc => console.log(doc)).catch(e => {
    //     console.log(e)
    // })


// const users1 = [{ name: "Shneor", password: "123", role: "admin", assignRoom: "assignRoom1" },
//     { name: "Dudi", password: "456", role: "child", assignRoom: "assignRoom1" },
//     { name: "Lior", password: "789", role: "child", assignRoom: "assignRoom1" },
//     { name: "Katya", password: "159", role: "guest", assignRoom: "assignRoom1" }
// ]

app.post('/login', (req, res) => {
    const { username, password } = req.body; //getting the value in server

    console.log(username, password) //for check

    let isUserExist = true
    let role = 'denied'

    // const indexUser = users.findIndex(user => user.username === username && user.password === password);
    // if (indexUser > -1) { //-1 = if not found
    //     isUserExist = true
    //     role = users[indexUser].role
    // }

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