const express = require('express')
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { check } = require('express-validator')
const { validationResult } = require('express-validator')
const secret = 'SECRET_KEY_RANDOM'
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express(); ///server;
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

// saltRounds means - 
const saltRounds = 7;

//-----------mongoose----------//
const mongoose = require('mongoose'); //npm i mongoose
const url = 'mongodb+srv://KatyaRu:ZX2hNfwMksy10h4u@cluster0.mfqlq.mongodb.net/test'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useCreateIndex: true
}).then(() => console.log("DB CONNECTION SUCCESSFUL")); //connectin to the db

//-----MODELS------//
const User = mongoose.model('User', {
    username: {
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
        default: "user",
    },
    assignRooms: {
        type: [String],
        
    
    }
});

const Room = mongoose.model("Room", {
    roomName: {
        type: String,
        unique: true,
        required: true,
    },
    notes: {
        type: [String],
    },

    assignUsers: {
        type: [Object],
        
    
    }
});

// ---------ADMIN-----------//

const isAdmin = (req, res, next) => {
       jwt.verify(req.cookies['token'], secret, (err, decodedToken) => {
        req.user = decodedToken;
        console.log(req.user)
        const role = decodedToken.role
        if (decodedToken.role === "admin") {

        next()
    }else {
        res.send({ admin: false });
    }
     
    })
}
const getUserId = (req, res, next) => {
    jwt.verify(req.cookies['token'], secret, (err, decodedToken) => {
     req.user = decodedToken;
     console.log('decodedToken!!!!!!!!!!!!!!!!!!!!!!:', decodedToken)
     const userId = decodedToken.id
     console.log( 'userId!!!!!!!!!!!!!!!!!!!!!!!!!!!:' , userId)
     if (userId) {
        next()
 
        res.send({ userId})
     }

     ;
 
  
 })
}

app.get("/api/checkadmin", isAdmin, async (req, res) => {
    res.send({ admin: true });
  });

  app.get("/api/getUserId",  getUserId, async (req, res) => {
      console.log('UUUUUUUUUUUUUUUUUSSSSSSSSSSEEEEEEEEEEEEEEEEERRRRRRRRRRR', userId)
    res.send({userId});
  });

// Get all users
app.get("/api/users", async(req, res) => {
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
app.get("/api/users/:id", async(req, res) => {
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
app.delete("/api/users/:id", async(req, res) => {
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
app.put("/api/addusers", async(req, res) => {
    try {
        const {roomID, userId, nameUser} = req.body
        console.log(roomID, userId, nameUser)
        const rooms = await Room.findById(roomID).elemMatch("assignUsers",{"userId":userId});
        console.log('rooooooooooooooms:', rooms)
        if(rooms == null){
        await User.findByIdAndUpdate(userId, { $push: { assignRooms: roomID}})
        await Room.findByIdAndUpdate(roomID, { $push: { assignUsers: {nameUser, userId} }})
        return res.status(201).send(
            { message: 'user added successfully' }
        ); 
        } else {
            return res.status(400).json({
                message: 'This user has already been added'
            })
        }


        
   } catch (err) {
        res.status(400).send({
            err
        });
    }
    })

//----------LOGIN-------------//
app.post("/api/login", async(req, res) => {
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
        console.log(validPassword)
        if (!validPassword) {
            return res.status(400).json({
                message: 'invalid password'
            })
        }

        const token = generateAccessToken(user)
        console.log(token)
        res.cookie("token", token, {
            maxAge: 15000000,
            httpOnly: false,
        });
        console.log(user.role)
        if (user.role == 'admin') {
            return res.json({
                status: 'allowed2'
            })
        }
        if (user.role == 'user') {
            return res.json({
                status: 'allowed1'
            })
        }



    } catch (e) {
        console.log(e)
        res.status(400).json({
            message: 'Login error'
        })
    }

});

//-------------CREATE ACCOUNT-----------//
app.post("/api/register", [
    check('username', 'Username cannot be empty').notEmpty(), check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 3 - 10 characters').isLength({ min: 3, max: 10 })
], async(req, res) => {
    const errors = validationResult(req)
    console.log("errors:", errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: `${errors.errors[0].msg}`, errors })
    }
    const newUser = new User(req.body);
    const { confirmPassword } = req.body
    if (newUser.password !== confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
    }
    encryptionGenerator(newUser, res);
})

//-------------RESET PASSWORD--------------//
app.post("/reset", async(req, res) => {
    try {
        const {userEmail} = req.body
        console.log(userEmail)
        const serchEmail = await User.findOne({ email: userEmail });
        console.log(serchEmail)
         if (serchEmail) {
          const userId = serchEmail._id;
          console.log(userId)
          const encodId = jwt.sign({userId}, secret, {expiresIn: '20m'});
          console.log('OOOOOOOOOOOOOOOOOO:', encodId)
          const sendData = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: process.env.EMAIL,
                      pass: process.env.PASSWORD,
                    },
                  });
                  const mailDetails = {
              from: 'opan1601@gmail.com',
              to: serchEmail,
              subject: 'Account Activation Link',
              html: `<h2>Hi, ${serchEmail.username}<br>Please click to given link to reset your password</h2>
              <p>${process.env.CLIENT_URL}/resetpassword/${encodId}</p>`
          }

          sendData.sendMail(mailDetails, function (e, info) {
                if (e) {
                  res.send({ email: "failed" });
                } else {
                  res.send({ email: "success" });
                }
              });
            } else {
              res.send({ email: "failed" });
            }
          } catch (e) {
            console.log(e.message);
            res.send({ status: "unauthorized" });
          }
        
    
    }

)



//-----------------------------ROOM FUNCTIONS------------------------------------//
//-------------CREATE ROOM--------------//
app.post("/api/room", async(req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).send({ newRoom });
    } catch (error) {
        res.status(404).send({ error });
    }
});

//-----DELETE ROOM-------//
app.delete("/api/deleteroom", async(req, res) => {
    try {
        const { roomId } = req.body
        await Room.findByIdAndDelete(roomId);
        res.status(200).send({ status: "deleted" });
    } catch (error) {
        res.status(404).send({ error });
    }
});

//-------------UPDATE ROOM--------------//
app.patch("/room", async(req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).send({ rooms });
    } catch (err) {
        res.status(400).send({ err });
    }
});

//-------------ROOM INFO--------------//
app.get("/api/room/:id", async(req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).send({
            room,
        });
    } catch (error) {
        res.status(404).send({ error });
    }
});
//-------------GET ALL ROOMS--------------//
app.post('/api/allrooms', async(req, res) => {
    try {
        const {isAdmin, userId} = req.body
        console.log(req.body)
        if(isAdmin == true){
            const rooms = await Room.find({});
            res.status(200).send({
                rooms,
    
            })
        }else{
            const rooms = await Room.find().elemMatch("assignUsers",{"userId":userId});
            console.log(rooms)
            res.status(200).send({
                rooms,
    
            })
        }
       
    } catch (error) {
        res.status(404).send({ error });
    }
});

//----------------------------- TASK FUNCTIONS----------------------//
//-----CREATE TASK-------//
app.post("/api/notes", async(req, res) => {
    try {
        const { createTask, roomId } = req.body
        await Room.findByIdAndUpdate(roomId, { $push: { notes: createTask } })
        res.status(200).send({ status: "update" });
    } catch (error) {
        res.status(404).send({ error });
    }
});

//-----DELETE TASK-------//
app.delete("/api/deletenotes", async(req, res) => {
    try {
        const { deleteTask, roomId } = req.body
        console.log(roomId, deleteTask)
        await Room.findByIdAndUpdate(roomId, { $pull: { notes: deleteTask } })
        res.status(200).send({ status: "deleted" });
    } catch (error) {
        res.status(404).send({ error });
    }
});

app.delete("/api/deleteuser", async(req, res) => {
    try {
        const { userId, roomId, nameUser } = req.body
        console.log(req.body)
        console.log(roomId, userId, nameUser)
        await User.findByIdAndUpdate(userId, { $pull: { assignRooms: roomId } })
        await Room.findByIdAndUpdate(roomId, { $pull: { assignUsers: {nameUser, userId} } })
        
        res.status(200).send({ status: "deleted" });
    } catch (error) {
        res.status(404).send({ error });
    }
});

//---------ONLOAD-------------//
// app.post("/api/onload", getUserAuthMiddle, async(req, res) => {
//     try {
//         const assignedRooms = req.user.user.assignRooms;
//         let rooms = [];
//         for (const roomId of assignedRooms) {
//             let roomFromDb = await Room.findById(roomId);
//             rooms.push(roomFromDb);
//         }
//         res.send({ rooms })

//     } catch (err) {
//         res.status(404).send({ err });
//     }

// });

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

//-------------encryptions-----------//
const generateAccessToken = (user) => {
    const payload = { user, role: user.role, id: user.id }
    return jwt.sign(payload, secret, { expiresIn: '24h' })
}
const encryptionGenerator = (newUser, res) => {
    bcrypt.hash(newUser.password, saltRounds, async(err, hash) => {
        try {
            newUser.password = hash;
            await newUser.save();
            creatTokenCookie(newUser, res);
            res.send({ message: 'user registered successfully' });
        } catch (e) { res.send({ message: `Registration error: ${e}` }); }
    });
}
const creatTokenCookie = (newUser, res) => {
    const token = generateAccessToken(newUser._id, newUser.role);
    console.log("token:", token);
    res.cookie("token", token, {
        maxAge: 1500000,
        httpOnly: true,
    });
}