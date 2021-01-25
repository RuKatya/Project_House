const express = require('express')
const jwt = require("jwt-simple");
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const {
    check
} = require('express-validator')
const {
    validationResult
} = require('express-validator')

const app = express(); ///server;

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());


const saltRounds = 7;
const jwtSecret = "23";


//-----------mongoose----------//
const mongoose = require('mongoose'); //npm i mongoose
const url = 'mongodb+srv://KatyaRu:qHO9SxoCGZc6lv7C@cluster0.mfqlq.mongodb.net/test'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB CONNECTION SUCCESSFUL")); //connectin to the db
//connectin to the db

//-----MODELS------//
const User = mongoose.model('User', { //collection
    name: {
        type: String,
        unique: true,
        required: [true, "To register you must enter username"],
        trim: true
    }, //with big letter !!!
    email: {
        type: String,
        unique: true,
        required: [true, "To register you must enter Email"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "To register you must enter password"],
        trim: true
    },
    role: {
        type: String,
        default: "child"
    },
    assignRooms: {
        type: [String]
    }
});

const Room = mongoose.model("Room", {
    //collection
    roomName: {
        type: String,
        required: true,
    },
});


// ---------ADMIN-----------//

isAdmin = (req, res, next) => {
    res.authorized = false;
    const {
        role
    } = req.cookies;


    if (role === 'admin') {
        res.authorized = true;
        console.log(res.authorized)
    }

    next()
}

// Client Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/rooms", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/rooms.html"));
});

//----------CHECK VALIDATION-------------//
app.get("/api/read", (req, res) => {
    let {
        cookies
    } = req;
    if (cookies == admin || cookies == child)
        res.send({
            ok: true,
        });
});

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({
            users
        });
    } catch (err) {
        res.status(404).send({
            err
        });
    }
});

// Get user by id
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send({
            user
        });
    } catch (err) {
        res.status(404).send({
            err
        });
    }
});

// delete user by id
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        res.status(200).send({
            user
        });
    } catch (err) {
        res.status(404).send({
            err
        });
    }
});

// update user by id
app.patch("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).send({
            user
        });
    } catch (err) {
        res.status(400).send({
            err
        });
    }
});

//----------LOGIN-------------//

app.post("/api/login", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;
     
        const user = await User.findOne({
            username
        });
        if (!user) {
            return res.status(400).json({
                message: 'User is not found'
            })
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                message: 'invalid password'
            })
        }
        const token = jwt.encode({
                role: User.role,
                username: User.username,
                assignRooms: User.assignRooms,
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
        return res.json({
            status: 'allowed'
        })

    } catch (e) {
        console.log(e)
        res.status(400).json({
            message: 'Login error'
        })
    }

});



//-------------CREATE ACCOUNT-----------//
app.post("/api/register", [
    check('name', 'Username cannot be empty').notEmpty(), check('email', 'username must be an email').isEmail(),
    check('password', 'password must be at least 3 - 10 characters').isLength({
        min: 3,
        max: 10
    })
], async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Registration error',
            errors
        })

    }
    console.log(errors)
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({
      newUser
    });


    bcrypt.hash(newUser.password, saltRounds, async  (err, hash) => {
        try {
            console.log('hash:', hash)
            newUser.password = hash;
            await newUser.save();
            console.log(newUser._id)
            const token = jwt.encode({
                    role: newUser.role,
                    name: newUser.name,
                    assignRooms: newUser.assignRooms,
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
            res.send({
                status: 'user registered successfully'
            });
        } catch (e) {
            console.log(e.message);
            console.log(e.stack);
            res.send({
                status: 'Registration error'
            });
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
    let lastRoomId = await Room.find({
        roomName: Selectedroom
    })
    console.log("lastRoomId: ", lastRoomId)
    let roomID = lastRoomId._id
    console.log("roomID: ", roomID)
    await Room.findByIdAndUpdate(roomID, {
        roomName: roomName,
        assignUser: assignUser
    })
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