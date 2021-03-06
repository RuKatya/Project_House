"use strict";

//---------LANDING PAGE---------//
hendleLoginPage = function hendleLoginPage(e) {
  e.preventDefault();
  document.getElementById("Login").style.display = "block";
  document.getElementById("CreateAccount").style.display = "none";
};

hendleCreatePage = function hendleCreatePage(e) {
  e.preventDefault();
  document.getElementById("Login").style.display = "none";
  document.getElementById("CreateAccount").style.display = "block";
}; //---------LOGIN---------//


hendleSubmitUsers = function hendleSubmitUsers(e) {
  e.preventDefault();
  var name = e.target.children.name.value;
  var password = e.target.children.password.value;
  console.log(name, password);
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      password: password
    })
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    console.log(data);

    if (data.ok == true) {
      window.location.href = 'rooms.html';
    } //  else {
    //     alert("go-out-of-here!!!!!!")
    // }

  });
};

function hendleGetIn() {
  fetch('/read').then(function (r) {
    return r.json();
  }).then(function (data) {
    if (data.ok === false) {
      window.location.href = 'index.html';
    }
  });
} //-------CREATE------//


function hendleCreate(e) {
  e.preventDefault();
  var name = e.target.children.name.value;
  var password = e.target.children.password.value;
  var role = e.target.children.role.value;
  console.log(name, password, role);
  fetch('/createAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      password: password,
      role: role
    })
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    console.log(data);
  });
} //-----WEATHER------//


function hendleSubmitWeater(e) {
  e.preventDefault();
  var city = e.target.children.city.value;
  console.log(city);
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      city: city
    })
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    console.log(data);

    if (data.weather.main.temp - 273.15 < 0) {
      document.getElementById('mainWeather').style.backgroundColor = "rgba(rgba(52, 52, 53, 0.507)";
      document.getElementById('weather').innerHTML = "<p class=\"img\"><img src=\"icons/cold.svg\" class=\"sizeOfIcons\"></p>\n                <p>The temperature is ".concat(Math.round(data.weather.main.temp - 273.15), " &#8451 </p>\n                <p>It's feels like ").concat(Math.round(data.weather.main.feels_like - 273.15), " &#8451</p>\n                <p>The wind speed is ").concat(data.weather.wind.speed, "</p>");
    } else if (0 < data.weather.main.temp - 273.15 < 20) {
      document.getElementById('mainWeather').style.backgroundColor = "rgba(15, 178, 219, 0.507)";
      document.getElementById('weather').innerHTML = "<p class=\"img\"><img src=\"icons/cool.svg\" class=\"sizeOfIcons\"></p>\n                <p>The temperature is ".concat(Math.round(data.weather.main.temp - 273.15), " &#8451 </p>\n                <p>It's feels like ").concat(Math.round(data.weather.main.feels_like - 273.15), " &#8451</p>\n                <p>The wind speed is ").concat(data.weather.wind.speed, "</p>");
    } else {
      document.getElementById('mainWeather').style.backgroundColor = "rgba(243, 239, 4, 0.507)";
      document.getElementById('weather').innerHTML = "<p class=\"img\"><img src=\"icons/hot.svg\" class=\"sizeOfIcons\"></p>\n                <p>The temperature is ".concat(Math.round(data.weather.main.temp - 273.15), " &#8451 </p>\n                <p>It's feels like ").concat(Math.round(data.weather.main.feels_like - 273.15), " &#8451</p>\n                <p>The wind speed is ").concat(data.weather.wind.speed, "</p>");
    }
  });
}