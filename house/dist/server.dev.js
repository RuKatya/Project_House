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
  var _req$body, name, password, validation, role, doc;

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
          _context.next = 8;
          return regeneratorRuntime.awrap(doc.name);

        case 8:
          _context.t1 = _context.sent;
          _context.t2 = name;
          _context.t0 = _context.t1 == _context.t2;

          if (!_context.t0) {
            _context.next = 13;
            break;
          }

          _context.t0 = doc.password == password;

        case 13:
          if (!_context.t0) {
            _context.next = 17;
            break;
          }

          validation = true;
          role = doc.role;
          res.cookie('role', role, {
            maxAge: 20000000,
            httpOnly: false
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}); //----------CHECK VALIDATION-------------//

app.get('/read', function (req, res) {
  var cookies = req.cookies;
  if (cookies == admin || cookies == child) res.send({
    ok: true
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
//-------------CREATE ACCOUNT-----------//

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

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //----------ROOM FUNCTIONS-------------//
//-------------CREATE ROOM--------------//

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

app["delete"]('/deleteroom', function _callee4(req, res) {
  var roomID, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          roomID = req.body.roomID;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Room.findByIdAndDelete(roomID));

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

app.put('/updateRoom', function _callee5(req, res) {
  var _req$body4, assignUser, roomName, Selectedroom, lastRoomId, roomID, data;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, assignUser = _req$body4.assignUser, roomName = _req$body4.roomName, Selectedroom = _req$body4.Selectedroom;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Room.find({
            roomName: Selectedroom
          }));

        case 3:
          lastRoomId = _context5.sent;
          console.log("lastRoomId: ", lastRoomId);
          roomID = lastRoomId._id;
          console.log("roomID: ", roomID);
          _context5.next = 9;
          return regeneratorRuntime.awrap(Room.findByIdAndUpdate(roomID, {
            roomName: roomName,
            assignUser: assignUser
          }));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(Room.find({}));

        case 11:
          data = _context5.sent;
          console.log("data: ", data);
          res.send({
            data: data
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //------------- ROOM INFO--------------//

app.post('/roomIinfo', function _callee6(req, res) {
  var roomID, data;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          roomID = req.body.roomID;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Room.findById(roomID));

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