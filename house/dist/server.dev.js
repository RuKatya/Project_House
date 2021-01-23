"use strict";

var express = require('express');

var app = express(); ///server;

var bodyParser = require('body-parser');

var fetch = require('node-fetch');

var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express["static"]('public'));
app.use(bodyParser.json()); //-----------mongoose----------//

var mongoose = require('mongoose'); //npm i mongoose


var url = 'mongodb+srv://KatyaRu:qHO9SxoCGZc6lv7C@cluster0.mfqlq.mongodb.net/test';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //connectin to the db

var User = mongoose.model('User', {
  //collection
  name: String,
  //with big letter !!!
  password: Number,
  role: String,
  assignRooms: [String]
});
var Room = mongoose.model('Room', {
  //collection
  roomName: String,
  assignUser: [String]
}); //-----------users-------------//

var Shneor = new User({
  name: "Shneor",
  password: "123",
  role: "admin",
  assignRooms: ["assignRoom1"]
});
var Dudi = new User({
  name: "Dudi",
  password: "456",
  role: "child",
  assignRooms: ["assignRoom1", "assignRoom2"]
});
var Lior = new User({
  name: "Lior",
  password: "789",
  role: "child",
  assignRooms: ["assignRoom1"]
}); // Lior.save().then(doc => console.log(doc)).catch(e => {
//     console.log(e)
// })

var Katya = new User({
  name: "Katya",
  password: "159",
  role: "guest",
  assignRooms: ["assignRoom1"]
}); // ---------ADMIN-----------//

isAdmin = function isAdmin(req, res, next) {
  res.authorized = false;
  var role = req.cookies.role;

  if (role === 'admin') {
    res.authorized = true;
    console.log(res.authorized);
  }

  next();
}; //----------LOGIN-------------//


app.post("/login", function _callee(req, res) {
  var _req$body, name, password, validation, role, doc, _ok;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, password = _req$body.password;
          validation = false;
          role = 'denied';
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            name: name
          }));

        case 5:
          doc = _context.sent;

          if (doc.name == name && doc.password == password) {
            _ok = false;
            validation = true;
            role = doc.role;
            res.cookie('role', role, {
              maxAge: 20000000,
              httpOnly: false
            });
          }

          if (role === 'child' || role === 'admin' || role === 'guest') ok = true;
          res.send({
            ok: ok
          }); //     res.cookie("User validated", name, { maxAge: 30000, httpOnly: true })
          // } else {
          //     alert(`Sorry ${e.name} doesn't exist`);
          // }
          // res.send({ validation });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}); // let role = 'denied';
// const indexUser = users.findIndex(User => user.name === name && user.password === password);
// if (indexUser > -1) {
//     isUserExist = true;
//     role = users[indexUser].role;
// }
// let ok = false;
// res.cookie('role', role, { maxAge: 20000000, httpOnly: false });
// if (role === 'public' || role === 'admin') ok = true;
// res.send({ ok })

app.get("/check-valid", function (req, res) {
  var validation = true;
  var checkCookie = req.cookies.validated;

  if (checkCookie == false) {
    validation = false;
  }

  res.send({
    validation: validation
  });
}); //-------------CREATE ACCOUNT-----------//

app.post('/createAccount', function _callee2(req, res) {
  var _req$body2, name, password, role, newUser;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, password = _req$body2.password, role = _req$body2.role;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new User({
            name: name,
            password: password,
            role: role
          }));

        case 3:
          newUser = _context2.sent;
          newUser.save().then(function (doc) {
            return console.log(doc);
          })["catch"](function (e) {
            return console.log(e);
          });
          console.log(name, password, role);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //----------ROOM FUNCTIONS-------------//

app.get('/read', function (req, res) {
  res.send({
    ok: true
  });
}); //-------------CREATE ROOM--------------//

app.post("/createRoom", function _callee3(req, res) {
  var _req$body3, roomName, assignUser, assignHouse, newRoom;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, roomName = _req$body3.roomName, assignUser = _req$body3.assignUser, assignHouse = _req$body3.assignHouse;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Room({
            roomName: roomName,
            assignUser: assignUser,
            assignHouse: assignHouse
          }));

        case 3:
          newRoom = _context3.sent;
          newRoom.save().then(function (doc) {
            return console.log(doc);
          })["catch"](function (e) {
            return console.log(e);
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //-------------DELETE ROOM--------------//

app.post('/deleteroom', function _callee4(req, res) {
  var dataID, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          dataID = req.body.dataID;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Room.findByIdAndDelete(dataID));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(Room.find({}));

        case 5:
          data = _context4.sent;
          res.send({
            data: data
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //-------------UPDATE ROOM--------------//

app.post('/updateRoom', function _callee5(req, res) {
  var dataID, data;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          dataID = req.body.dataID;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Room.findById(dataID));

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(Room.find({}));

        case 5:
          data = _context5.sent;
          res.send({
            data: data
          });

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //------------- ROOM INFO--------------//

app.post('/roomIinfo', function _callee6(req, res) {
  var dataID, data;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          dataID = req.body.dataID;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Room.findByIdfindByIdAndUpdate(dataID));

        case 3:
          _context6.next = 5;
          return regeneratorRuntime.awrap(Room.find({}));

        case 5:
          data = _context6.sent;
          res.send({
            data: data
          });

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
}); //-------------WEATHER-----------//

app.post('/weather', function (req, res) {
  var city = req.body.city;
  console.log(city);
  fetch("http://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&appid=84dda819f36a2f81e3babdb748579c85")).then(function (r) {
    return r.json();
  }).then(function (weather) {
    res.send({
      ok: true,
      weather: weather
    });
  });
});
var PORT = 3030;
app.listen(PORT, function () {
  console.log("RUNNING: ".concat(PORT));
});