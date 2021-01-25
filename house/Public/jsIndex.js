//---------LANDING PAGE---------//
hendleLoginPage = (e) => {
    e.preventDefault();
    document.getElementById("Login").style.display = "block"
    document.getElementById("CreateAccount").style.display = "none"

}
hendleCreatePage = (e) => {
    e.preventDefault();
    document.getElementById("Login").style.display = "none"
    document.getElementById("CreateAccount").style.display = "block"

}

//---------LOGIN---------//
hendleSubmitUsers = (e) => {
    e.preventDefault();

    const name = e.target.children.name.value;
    const password = e.target.children.password.value;
    console.log(name, password)

    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                password
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
            if(data.status == "allowed"){
                window.location.href='rooms.html'
           } //  else {
            //     alert("go-out-of-here!!!!!!")
            // }
        })
}

function hendleGetIn(){
    fetch('/read')
      .then(r => r.json())
      .then(data => {
        if(data.ok === false){
          window.location.href='index.html'
      }})
}

//-------CREATE------//
function handleCreate(e) {
    e.preventDefault();

    const name = e.target.children.name.value;
    const email = e.target.children.email.value;
    const password = e.target.children.password.value;
    const checkPassword = e.target.children.checkPassword.value;
    console.log(name, password, email, checkPassword)

     fetch('/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password, 
                checkPassword
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
            if(data.status == "Registration error"){
                window.location.href='rooms.html'
            }
        }) 
}

//-----WEATHER------//
function hendleSubmitWeater(e) {
    e.preventDefault();

    const city = e.target.children.city.value;

    console.log(city)

    fetch('/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                city
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)

            if ((data.weather.main.temp - 273.15) < 0) {
                document.getElementById('mainWeather').style.backgroundColor = "rgba(rgba(52, 52, 53, 0.507)"
                document.getElementById('weather').innerHTML = `<p class="img"><img src="icons/cold.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            } else if (0 < (data.weather.main.temp - 273.15) < 20) {
                document.getElementById('mainWeather').style.backgroundColor = "rgba(15, 178, 219, 0.507)"
                document.getElementById('weather').innerHTML = `<p class="img"><img src="icons/cool.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            } else {
                document.getElementById('mainWeather').style.backgroundColor = "rgba(243, 239, 4, 0.507)"
                document.getElementById('weather').innerHTML = `<p class="img"><img src="icons/hot.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            }
        })
}
