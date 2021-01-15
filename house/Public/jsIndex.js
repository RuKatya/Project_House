function hendleSubmitUsers(e) {
    e.preventDefault();

    const username = e.target.children.username.value;
    const password = e.target.children.password.value;

    console.log(username, password)

    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
        })
}

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
                document.getElementById('weather').innerHTML = `<p class="img"><img src="cold.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            } else if (0 < (data.weather.main.temp - 273.15) < 20) {
                document.getElementById('mainWeather').style.backgroundColor = "rgba(15, 178, 219, 0.507)"
                document.getElementById('weather').innerHTML = `<p class="img"><img src="cool.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            } else {
                document.getElementById('mainWeather').style.backgroundColor = "rgba(243, 239, 4, 0.507)"
                document.getElementById('weather').innerHTML = `<p class="img"><img src="hot.svg" class="sizeOfIcons"></p>
                <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
                <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
                <p>The wind speed is ${data.weather.wind.speed}</p>`;
            }
        })
}