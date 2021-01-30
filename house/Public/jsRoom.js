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

//-----CREATE ROOM-------// ----THIS IS TASK OR WHAT?

function getAllRooms(rooms) {
    let display = ''
    fetch('/allrooms')
        .then(r => r.json())
        .then(data => {
            if (data.rooms == 'undefined') {

            }
            data.rooms.forEach(room => {
                const listTasks = room.notes.map((task) => `<div>${task}
                <button id="${room._id}" name="${task}" class="deleteTask" onclick="handleDeleteTask(event)">Done</button>
                </div>`).join(' ')

                display += `<div class="roomsAndTask">
                <div class="gridHeadline">
                    <h3>${room.roomName}</h3>
                    <button id="${room._id}" onclick="handleDeleteRoom(event)" class="deleteRoom">Delete room</button>
                </div>
                <form id="${room._id}" class="formTask" onsubmit='handleAddTask(event)'>
                    <input class="newTask" type='text' placeholder="add task" name='newTask' required>
                    <input type="submit" class="addTask" value="Add task">
                </form><div class="listTask">${listTasks}</div></div>`
            })
            document.getElementById('putRoom').innerHTML = display
        })

}

//-----DELETE ROOM-------//

function handleDeleteRoom(e) {
    e.preventDefault()
    const roomId = e.target.id

    console.log(roomId) //for check

    fetch('/api/deleteroom', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
            getAllRooms()
        })

}



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
            room.innerHTML += `<div class="roomsAndTask" name='${data.newRoom._id}'>
            <div class="gridHeadline">
                <h3>${data.newRoom.roomName}</h3>
                <button id="${data.newRoom._id}" onclick="handleDeleteRoom(event)" class="deleteRoom">Delete room</button>
            </div>
            <form id="${data.newRoom._id}" onsubmit='handleAddTask(event)' class="formTask">
                <input id="newTask" class="newTask" type='text' placeholder="add task" name='newTask' required>
                <input type="submit" class="addTask" value="add task">
            </form></div>`
        })
}

//-----CREATE TASK-------//
function handleAddTask(e) {
    e.preventDefault()
    const createTask = e.target.children.newTask.value
    const roomId = e.target.id
    console.log('roomId:', roomId)
    const newTask = document.getElementById('newTask')
    const rooms = document.getElementById('putRoom')

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
            getAllRooms()
        })
}


//-----DELETE TASK-------//
function handleDeleteTask(e) {
    e.preventDefault()
    const roomId = e.target.id
    const deleteTask = e.target.name
        // const rooms = document.getElementById('putRoom')

    fetch('/api/deletenotes', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deleteTask,
                roomId
            })
        }).then(r => r.json())
        .then(data => {
            console.log(data)
            getAllRooms()
        })
}

document.addEventListener('DOMContentLoaded', getAllRooms())