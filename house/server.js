const express = require('express')
const app = express(); ///server;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
const bcrypt = require('bcryptjs');
const jwt = require("jwt-simple");
const saltRounds = 7;
const jwtSecret = "23";
const {check} = require('express-validator')
const {validationResult} = require('express-validator')

//-----------mongoose----------//
const mongoose = require('mongoose'); //npm i mongoose
const url = 'mongodb+srv://KatyaRu:qHO9SxoCGZc6lv7C@cluster0.mfqlq.mongodb.net/test'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //connectin to the db

const User = mongoose.model('User', { //collection
    name: {
type: String,
unique: true,
reqiired: true,
trim: true
    } , //with big letter !!!
 email: {
     type: String,
     unique: true,
     required: true,
     trim: true,
     },    
password: {
    type: String,
    required: true,
    trim: true
},
role: {
    type: String,
    default: "user"
},
assignRooms:{
    type: [String]
}
    //assignRooms: [String]
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
    try{
        const {name,password} = req.body;
        /* let validation = false;
        let role = 'denied'; */
        const user = await User.findOne({name});
        if(!user) {
            return res.status(400).json({message: 'User is not found'})
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if(!validPassword){
            return res.status(400).json({message: 'invalid password'})
        }
        const token = jwt.encode(
            {
              role: User.role,
              name: User.name,
              assignRooms: User. assignRooms,
              time: new Date().getTime(),
              id: User._id
            },
            jwtSecret
          );
          console.log(token)
          res.cookie("token", token, {
            maxAge: 1500000,
            httpOnly: true,
          });
          return res.json({status: 'allowed'})
          
    } catch (e){
        console.log(e)
        res.status(400).json({message:'Login error'})
    }
     /* if (await doc.name == name && doc.password == password) {
       
        validation = true;
        role = doc.role
        res.cookie('role', role, {maxAge: 20000000,httpOnly: false});
    } */
  
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
app.post('/createAccount', [
    check('name', 'Username cannot be empty').notEmpty(),check('email', 'username must be an email').isEmail(),
check('password', 'password must be at least 4 - 10 characters').isLength({min:4, max:10})
], async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
     return res.status(400).json({message: 'Registration error', errors})
     
    }
    console.log(errors)
    const { name, email, password, checkPassword } = req.body;
    console.log(req.body)
  
     const newUser = await new User({
        name,
        email,
        password,
        checkPassword
    });
    console.log(newUser)


        bcrypt.hash(newUser.password, saltRounds, async function(err, hash) {
            try {
                console.log('hash:', hash)
              newUser.password = hash;
              await newUser.save();
              console.log(newUser._id)
              const token = jwt.encode(
                {
                  role: newUser.role,
                  name: newUser.name,
                  assignRooms: newUser. assignRooms,
                  time: new Date().getTime(),
                  id: newUser._id
                },
                jwtSecret
              );
              console.log(token)
              res.cookie("token", token, {
                maxAge: 1500000,
                httpOnly: true,
              });
              res.send({ status: 'user registered successfully' });
            } catch (e) {
              console.log(e.message);
              console.log(e.stack);
              res.send({ status: 'Registration error' });
              res.end();
            }
        });
    
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