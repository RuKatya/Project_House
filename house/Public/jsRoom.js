//---------CORRECT TIME-------//
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

//---------CORRECT DATE---------//
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

//-----CREATE ROOM-------//

function getAllRooms() {

    fetch('/allrooms')
        .then(r => r.json())
        .then(data => {
          
            data.rooms.forEach(room => {
                document.getElementById('putRoom').innerHTML +=
                `<div class="huina"><h1>${room.roomName}</h1><form id="${room._id}" onsubmit='handleAddTask(event)'>
                <input id="newTask" type='text' placeholder="add task" name='newTask' required>
                <input type="submit" value="add task">
            </form> 
                         <div>${room.notes}</div></div>`
                
            
           
            })
        })
}

document.addEventListener('DOMContentLoaded', getAllRooms())

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
            room.innerHTML += `<div class="huina" name='${data.newRoom._id}'><h1>${data.newRoom.roomName}</h1><form id="${data.newRoom._id}" onsubmit='handleAddTask(event)'>
            <input id="newTask" type='text' placeholder="add task" name='newTask' required>
            <input type="submit" value="add task">
        </form> 
                     <div>${data.notes}</div></div>`
        })
}


//-----CREATE TASK-------//
function handleAddTask(e) {
    e.preventDefault()
    const createTask = e.target.children.newTask.value
    const roomId = e.target.id
    console.log('roomId:', roomId)
    const newTask = document.getElementById('newTask')
    
    console.log(createTask) 

    fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                createTask,
                roomId
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
           
           /*  room.innerHTML += `<div class="huina"><h1>${data.newRoom.roomName}</h1><form onsubmit='HandleAddTask(event)'>
            <input type='text' placeholder="name" name='name' required>
            <input type="submit" value="add task">
        </form> 
                     <div>${data.notes}</div></div>` */
        }) 
} 



// //--------DELETE ROOMS----------//
// // const roomName = event.target.dataset.id

// fetch('/api/room', {
//         method: 'delete',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             roomName
//         })
//     }).then(r => r.json())
//     .then(data => {
//         console.log(data)
//     })

// //--------UPDATE ROOM----------//
// fetch('/api/room', {
//         method: 'patch',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             roomName
//         })
//     }).then(r => r.json())
//     .then(data => {
//         console.log(data)
//     })

//---------ONLOAD----------//
/* function allrooms() {
    fetch('/api/onload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
            setRoomsOnPage(data.rooms)
                // console.log(data.newRoom.roomName)
        })
}

const setRoomsOnPage = (rooms) => {
    const roomsToShow = rooms.map((room) => `<p>${room.roomName}</p>`)
    console.log(rooms)
    document.getElementById('putRoom').innerHTML = roomsToShow.join(' ');

} */