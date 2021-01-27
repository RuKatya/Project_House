//---------Correct time-----//
function getTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    let time = `${hours}:${minutes}:${seconds}`;
    document.getElementById('correctTime').innerHTML = time;
}
setInterval(getTime, 0);

//-----------Correct Date---------//
function getDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear()

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    let dateToday = `${day}/${month}/${year}`
    document.getElementById('correctDate').innerHTML = dateToday

}
setInterval(getDate, 0)

//-----Create room-------//
function hendleCreateRoom(e) {
    e.preventDefault()
    const roomName = e.target.children.roomName.value
    const room = document.getElementById('putRoom')

    console.log(roomName) //for check

    fetch('/api/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data.newRoom._id)
            console.log(data.newRoom.roomName)
            room.innerHTML = `<div class="huina"><h1>${data.newRoom.roomName}</h1></div>`
        })
}

//--------Delete rooms----------//
// const roomName = event.target.dataset.id

fetch('/api/room', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomName
        })
    }).then(r => r.json())
    .then(data => {
        console.log(data)
    })

//--------Update room------------//
fetch('/api/room', {
        method: 'patch',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomName
        })
    }).then(r => r.json())
    .then(data => {
        console.log(data)
    })

function allrooms() {

}