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

const User = mongoose.model('User', { //collection
    name: String, //with big letter !!!
    password: Number,
    role: String,
    assignRooms: [String]
});

const Room = mongoose.model('Room', { //collection
    roomName: String,
    assignUser: [String],
});

//-----------users-------------//
const Shneor = new User({
    name: "Shneor",
    password: "123",
    role: "admin",
    assignRooms: ["assignRoom1"]
})


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
// Lior.save().then(doc => console.log(doc)).catch(e => {
//     console.log(e)
// })

const Katya = new User({
    name: "Katya",
    password: "159",
    role: "guest",
    assignRooms: ["assignRoom1"]
})



// ---------ADMIN-----------//

isAdmin = (req, res, next) => {
    res.authorized = false;
    const {
        role
    } = req.cookies


    if (role === 'admin') {
        res.authorized = true;
        console.log(res.authorized)
    }

    next()
}

//----------LOGIN-------------//
app.post("/login", async (req, res) => {
    let {name,password} = req.body;
    let validation = false;
    let role = 'denied';
    let doc = await User.findOne({
        name:name
    });
     if (await doc.name == name && doc.password == password) {
       
        validation = true;
        role = doc.role
        res.cookie('role', role, {maxAge: 20000000,httpOnly: false});
    }
  
    //     res.cookie("User validated", name, { maxAge: 30000, httpOnly: true })
    // } else {
    //     alert(`Sorry ${e.name} doesn't exist`);
    // }
    // res.send({ validation });
});
//----------CHECK VALIDATION-------------//
app.get('/read', (req, res) => {
    let {cookies} = req
    if (cookies == admin ||  cookies == child )
    res.send({
        ok: true
    })
})

// let role = 'denied';

// const indexUser = users.findIndex(User => user.name === name && user.password === password);
// if (indexUser > -1) {
//     isUserExist = true;
//     role = users[indexUser].role;
// }

// let ok = false;
// res.cookie('role', role, { maxAge: 20000000, httpOnly: false });

// if (role === 'public' || role === 'admin') ok = true;

// res.send({ ok })

//-------------CREATE ACCOUNT-----------//
app.post('/createAccount', async (req, res) => {
    let {
        name,
        password,
        role
    } = req.body;

    const newUser = await new User({
        name,
        password,
        role
    });
    newUser.save().then(doc => console.log(doc)).catch(e => console.log(e));
})


//----------ROOM FUNCTIONS-------------//

//-------------CREATE ROOM--------------//
app.post("/createRoom", async (req, res) => {
    let {
        roomName,
        assignUser,
        assignHouse
    } = req.body;
    const newRoom = await new Room({
        roomName,
        assignUser,
        assignHouse
    });
    newRoom.save().then(doc => console.log(doc)).catch(e => console.log(e));
});

//-------------DELETE ROOM--------------//
app.delete('/deleteroom', async (req, res) => {
    const {
        roomID
    } = req.body
    await Room.findByIdAndDelete(roomID)
    const data = await Room.find({})
    res.send({
        data
    })
})

//-------------UPDATE ROOM--------------//
app.put('/updateRoom', async (req, res) => {
    
    const {
        assignUser,
        roomName,
        Selectedroom
    } = req.body
    let lastRoomId = await Room.find({roomName:Selectedroom})
    console.log("lastRoomId: ", lastRoomId)
    let roomID = lastRoomId._id
    console.log("roomID: ", roomID)
    await Room.findByIdAndUpdate(roomID,{roomName:roomName, assignUser: assignUser})
    const data = await Room.find({})
    console.log("data: ", data)
    res.send({
        data
    })
})

//------------- ROOM INFO--------------//
app.post('/roomIinfo', async (req, res) => {
    const {
        roomID
    } = req.body
    await Room.findById(roomID)
    const data = await Room.find({})
    res.send({
        data
    })
})

//-------------WEATHER-----------//

app.post('/weather', (req, res) => {
    const {
        city
    } = req.body;
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