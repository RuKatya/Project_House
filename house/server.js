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
    const doc = await User.findOne({
        name
    });
    if (doc.name == name && doc.password == password) {
        let ok = false;
        validation = true;
        role = doc.role
        res.cookie('role', role, {maxAge: 20000000,httpOnly: false});
    }
    if (role === 'child' || role === 'admin' || role === 'guest') ok = true;

    res.send({
        ok
    })
    //     res.cookie("User validated", name, { maxAge: 30000, httpOnly: true })
    // } else {
    //     alert(`Sorry ${e.name} doesn't exist`);
    // }
    // res.send({ validation });
});

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

app.get("/check-valid", (req, res) => {
    let validation = true;
    const checkCookie = req.cookies.validated;
    if (checkCookie == false) {
        validation = false;
    }
    res.send({
        validation
    });
});

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

    console.log(name, password, role)

})


//----------ROOM FUNCTIONS-------------//

app.get('/read', (req, res) => {
    res.send({
        ok: true
    })
})

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
app.post('/deleteroom', async (req, res) => {
    const {
        dataID
    } = req.body
    await Room.findByIdAndDelete(dataID)
    const data = await Room.find({})
    res.send({
        data
    })
})

//-------------UPDATE ROOM--------------//
app.post('/updateRoom', async (req, res) => {
    const {
        dataID
    } = req.body
    await Room.findById(dataID)
    const data = await Room.find({})
    res.send({
        data
    })
})

//------------- ROOM INFO--------------//
app.post('/roomIinfo', async (req, res) => {
    const {
        dataID
    } = req.body
    await Room.findByIdfindByIdAndUpdate(dataID)
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