"use strict";

onPageLoad();

function mysubmit(event) {
  event.preventDefault();
  var memo = event.target.children.memo.value;
  var room = document.querySelector('#roomList').value;
  fetch("/createRoom", {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache'
    },
    body: JSON.stringify({
      memo: memo,
      room: room
    })
  }).then(function (a) {
    return a.json();
  }).then(function (DBinfo) {
    printData(DBinfo.data);
  });
}

function deleteRoom(e) {
  var dataID = e.target.dataset.id;
  fetch("/deleteRoom", {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dataID: dataID
    })
  }).then(function (a) {
    return a.json();
  }).then(function (data) {
    printData(data.data);
  });
}

function onPageLoad() {
  fetch("/onPageLoad").then(function (a) {
    return a.json();
  }).then(function (data) {
    printData(data.data);
  });
}

function statusRoom(event) {
  var checkBox = event.target.checked;
  var dataID = event.target.dataset.id;
  fetch("/checkIf", {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      checkBox: checkBox,
      dataID: dataID
    })
  }).then(function (a) {
    return a.json();
  }).then(function (data) {
    printData(data.data);
  });
}

var room1 = document.querySelector('.room1');
var room2 = document.querySelector('.room2');
var room3 = document.querySelector('.room3');
var room4 = document.querySelector('.room4');

function printData(data) {
  room1.innerHTML = '';
  room2.innerHTML = '';
  room3.innerHTML = '';
  room4.innerHTML = '';

  for (i = 0; i < data.length; i++) {
    var mmm = function mmm(data, style, checkBox) {
      var img = "<img src=\"img/icons8-close-window-100.png\" onclick=\"deleteRoom(event)\"";

      if (data[i].room == 'b') {
        room1.innerHTML += "<div class=\"lists\" style='".concat(style, "'>\n                <input type=\"checkbox\" ").concat(checkBox, " onclick=\"statusRoom(event)\"data-id=\"").concat(data[i]._id, "\">\n                <div class=\"list\">").concat(data[i].memo, "</div>").concat(img, "  data-id=\"").concat(data[i]._id, "\"></div>");
      } else if (data[i].room == 'c') {
        room2.innerHTML += "<div class=\"lists\" style='".concat(style, "'>\n                <input type=\"checkbox\" ").concat(checkBox, " onclick=\"statusRoom(event)\"data-id=\"").concat(data[i]._id, "\">\n                <div class=\"list\">").concat(data[i].memo, "</div>").concat(img, "  data-id=\"").concat(data[i]._id, "\"></div>");
      } else if (data[i].room == 'd') {
        room3.innerHTML += "<div class=\"lists\" style='".concat(style, "'>\n                <input type=\"checkbox\" ").concat(checkBox, " onclick=\"statusRoom(event)\"data-id=\"").concat(data[i]._id, "\">\n                <div class=\"list\">").concat(data[i].memo, "</div>").concat(img, "  data-id=\"").concat(data[i]._id, "\"></div>");
      } else if (data[i].room == 'e') {
        room4.innerHTML += "<div class=\"lists\" style='".concat(style, "'>\n                <input type=\"checkbox\" ").concat(checkBox, " onclick=\"statusRoom(event)\"data-id=\"").concat(data[i]._id, "\">\n                <div class=\"list\">").concat(data[i].memo, "</div>").concat(img, "  data-id=\"").concat(data[i]._id, "\"></div>");
      }
    };

    var style = 'rgba(181, 209, 200, 0.562);opacity:0.4;color:grey';

    if (data[i].status == 'true') {
      var _style = 'rgba(181, 209, 200, 0.562);opacity:0.4;color:grey';
      var checkBox = 'checked="true"';
      mmm(data, _style, checkBox);
    } else {
      var _style2 = 'rgba(181, 209, 200, 0.562)';
      var _checkBox = "dataset=\"false\"";
      mmm(data, _style2, _checkBox);
    }
  }
}