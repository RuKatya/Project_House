 //---------LANDING PAGE---------//
 let loginPage = document.getElementById("loginPage")
 let signInPage = document.getElementById("signInPage")
 let loginButton = document.getElementById("login__btn")
 let signInButton = document.getElementById("signIn__btn")
 let resetPage = document.getElementById('resetPage')

 hendleLoginPage = (e) => {
     e.preventDefault();
     loginPage.style.display = "block"
     signInPage.style.display = "none"
     signInButton.classList.remove("active");
     loginButton.classList.add("active");
     resetPage.style.display = "none"


 }
 hendleCreatePage = (e) => {
     e.preventDefault();
     loginPage.style.display = "none"
     signInPage.style.display = "block"
     signInButton.classList.add("active");
     loginButton.classList.remove("active");
     resetPage.style.display = "none"

 }

 showPageReset = (e) =>{
    loginPage.style.display = "none"
    signInPage.style.display = "none"
    resetPage.style.display = "block"
 }

 //---------LOGIN---------//
 hendleSubmitUsers = (e) => {
     e.preventDefault();

     const username = e.target.children.name.value;
     const password = e.target.children.password.value;
     console.log(username, password)

     fetch('/api/login', {
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
             if (data.status == "allowed1") {
                 window.location.href = 'rooms.html'
             }
             if (data.status == "allowed2") {
                 window.location.href = 'rooms.html'
             } else {
                 const message = document.getElementById('message__login')
                 message.innerHTML = `Invalid username or password`;
                 message.style.color = 'red'
             }
         })
 }

 //-------CREATE------//
 function handleCreate(e) {
     e.preventDefault();

     const username = e.target.children.name.value;
     const email = e.target.children.email.value;
     const password = e.target.children.password.value;
     const confirmPassword = e.target.children.confirmPassword.value;
     console.log(username, password, email, confirmPassword)

     fetch('/api/register', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 username,
                 email,
                 password,
                 confirmPassword
             })
         }).then(r => r.json())
         .then(data => {
             console.log(data)
             if (data.message == "user registered successfully") {
                 window.location.href = 'rooms.html'
             } else {
                 const message = document.getElementById('message__signIn')
                 message.innerHTML = `${data.message}`;
                 message.style.color = 'red'
             }
         })
 };

 //-------RESET PASSWORD------//

 handleResetPassword = (e) => {
    e.preventDefault();
  
    const userEmail = e.target.email.value
    console.log(userEmail)
  
    fetch("/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
          userEmail 
        }),
    })
      .then((res) => res.json())
      .then(async (data) => {
          console.log(data)
        // try {
        //   if (data.email == "success") {
        //     await Swal.fire({
        //       position: "top-center",
        //       icon: "success",
        //       title: "אימייל עם קישור לשחזור הסיסמה נשלח אלייך.",
        //       showConfirmButton: false,
        //       timer: 1500,
        //     });
        //     window.location.href = "/";
        //   } else {
        //     Swal.fire({
        //       icon: "error",
        //       title: "אופס...",
        //       text: "כנראה שקרתה שגיאה, לא הצלחנו לאתר את המייל שלך, נסה שוב..",
        //       confirmButtonColor: "red",
        //       confirmButtonText: "אישור",
        //     });
        //     const btn = document
        //       .getElementById("hideBtn")
        //       .setAttribute("style", "display:inherit");
        //   }
        // } catch (e) {
        //   console.log(e);
        // }
      });
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

             if (data.weather.main.temp - 273.15 < 0) {
                 document.getElementById('mainWeather').style.backgroundColor = "rgba(52, 52, 53, 0.507)"
                 document.getElementById('weather').innerHTML = `<p class="img"><img src="icons/cold.svg" class="sizeOfIcons"></p>
         <p>The temperature is ${Math.round(data.weather.main.temp-273.15)} &#8451 </p>
         <p>It's feels like ${Math.round(data.weather.main.feels_like-273.15)} &#8451</p>
         <p>The wind speed is ${data.weather.wind.speed}</p>`;
             } else if (data.weather.main.temp - 273.15 < 25) {
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
