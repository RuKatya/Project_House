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

var User = mongoose.model('user', {
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
  assignUser: [String],
  size: Number,
  assignHouse: String,
  lastClean: Date
}); //-----------users-------------//

var Shneor = new User({
  name: "Shneor",
  password: "123",
  role: "admin",
  assignRooms: ["assignRoom1"]
}); // Shneor.save().then(doc => console.log(doc)).catch(e => {
//     console.log(e)
// })

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
});
var Katya = new User({
  name: "Katya",
  password: "159",
  role: "guest",
  assignRooms: ["assignRoom1"]
}); //----------LOGIN-------------//

app.post("/login", function _callee(req, res) {
  var userName, password, validation, doc;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userName = req.body.userName;
          password = req.body.password;
          validation = false;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            name: userName
          }));

        case 5:
          doc = _context.sent;
          console.log(doc);

          if (doc.name == userName && doc.password == password) {
            validation = true;
          } else {
            validation = false;
            console.log("Sorry ".concat(e.userName, " doesn't exist"));
          }

          console.log(validation);

          if (validation) {
            res.cookie("User validated", userName, {
              maxAge: 30000,
              httpOnly: true
            });
          }

          res.send({
            validation: validation
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get("/check-valid", function (req, res) {
  var validation = true;
  var checkCookie = req.cookies.validated;

  if (checkCookie == false) {
    validation = false;
  }

  res.send({
    validation: validation
  });
}); //----------ROOM FUNCTIONS-------------//
//-------------CREATE ROOM--------------//

app.post("/createRoom", function _callee2(req, res) {
  var _req$body, roomName, assignUser, assignHouse, newRoom;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, roomName = _req$body.roomName, assignUser = _req$body.assignUser, assignHouse = _req$body.assignHouse;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Room({
            roomName: roomName,
            assignUser: assignUser,
            assignHouse: assignHouse
          }));

        case 3:
          newRoom = _context2.sent;
          newRoom.save().then(function (doc) {
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
}); //-------------DELETE ROOM--------------//

app.post('/deleteroom', function _callee3(req, res) {
  var dataID, data;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          dataID = req.body.dataID;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Room.findByIdAndDelete(dataID));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(Room.find({}));

        case 5:
          data = _context3.sent;
          res.send({
            data: data
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //-------------UPDATE ROOM--------------//
//------------- ROOM INFO--------------//

app.post('/deleteroom', function _callee4(req, res) {
  var dataID, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          dataID = req.body.dataID;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Room.findById(dataID));

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