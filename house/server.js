const express = require('express')
const app = express(); ///server;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());

//-----------mongoose----------//
const mongoose = require('mongoose'); //npm i mongoose
const url = 'mongodb+srv://KatyaRu:qHO9SxoCGZc6lv7C@cluster0.mfqlq.mongodb.net/test'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //connectin to the db

const User = mongoose.model('user', { //collection
    name: String, //with big letter !!!
    password: Number,
    role: String,
    assignRooms: [String]
});

const Room = mongoose.model('Room', { //collection
    roomName: String,
    assignUser: [String],
    size: Number,
    assignHouse: String,
    lastClean: Date,

});

//-----------users-------------//
const Shneor = new User({
        name: "Shneor",
        password: "123",
        role: "admin",
        assignRooms: ["assignRoom1"]
    })
    // Shneor.save().then(doc => console.log(doc)).catch(e => {
    //     console.log(e)
    // })

const Dudi = new User({
    name: "Dudi",
    password: "456",
    role: "child",
    assignRooms: ["assignRoom1", "assignRoom2"]
})
const Lior = new User({
    name: "Lior",
    password: "789",
    role: "child",
    assignRooms: ["assignRoom1"]
})
const Katya = new User({
    name: "Katya",
    password: "159",
    role: "guest",
    assignRooms: ["assignRoom1"]
})

//----------LOGIN-------------//
app.post("/login", async(req, res) => {
    let { userName,password } = req.body;
    let validation = false;
    const doc = await User.findOne({ name: userName });
    if (doc.name == userName && doc.password == password) {
        validation = true;
        res.cookie("User validated", userName, {maxAge: 30000,httpOnly: true})
    } else {
        alert(`Sorry ${e.userName} doesn't exist`);
    }
    res.send({validation});
});

app.get("/check-valid", (req, res) => {
  let validation = true;
  const checkCookie = req.cookies.validated;
  if (checkCookie == false) {
    validation = false;
  }
  res.send({ validation });
});

//----------ROOM FUNCTIONS-------------//

//-------------CREATE ROOM--------------//
app.post("/createRoom", async(req, res) => {
    let {roomName, assignUser, assignHouse} = req.body;
    const newRoom = await new Room({
        roomName,
        assignUser,
        assignHouse
    });
    newRoom.save().then(doc => console.log(doc)).catch(e => console.log(e));
});

//-------------DELETE ROOM--------------//
app.post('/deleteroom', async(req, res) => {
    const {dataID} = req.body
    await Room.findByIdAndDelete(dataID)
    const data = await Room.find({})
    res.send({data})
})

//-------------UPDATE ROOM--------------//

//------------- ROOM INFO--------------//
app.post('/deleteroom', async(req, res) => {
    const {dataID} = req.body
    await Room.findById(dataID)
    const data = await Room.find({})
    res.send({data})
})

//-------------WEATHER-----------//

app.post('/weather', (req, res) => {
    const {city} = req.body;
    console.log(city)
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=84dda819f36a2f81e3babdb748579c85`)
        .then(r => r.json())
        .then(weather => {
            res.send({
                ok: true,
                weather
            })
        })
})

const PORT = 3030;
app.listen(PORT, () => {
    console.log(`RUNNING: ${PORT}`)
})