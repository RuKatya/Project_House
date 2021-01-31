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

  //-----RENDER ROOMS PAGE-------// 

   getAllRooms = (rooms) => {

      let display = ''
      fetch("/api/allrooms")
          .then(r => r.json())
          .then(data => {
              console.log(data)
              const users = getAllUsers()
              console.log(users)
              


              data.rooms.forEach(room => {
                  const listTasks = room.notes.map((task) => `<div>${task}
                      <button id="${room._id}" name="${task}" class="deleteTask"
                          onclick="handleDeleteTask(event)">Done</button>
                  </div>`).join(' ')


                  display += `<div class="roomsAndTask">
                      <div class="gridHeadline">
                          <h3>${room.roomName}</h3> 

                          <select id ="users"> <option style="display: none">Select user </option>
                         
                      </select>
                     
                      <button id="${room._id}" onclick="addUserToRoom(event)" >add user to this room</button>
      
                          <button id="${room._id}" onclick="handleDeleteRoom(event)" class="deleteRoom">Delete
                              room</button>
                      </div>
                      <form id="${room._id}" class="formTask" onsubmit='handleAddTask(event)'>
                          <input class="newTask" type='text' placeholder="add task" name='newTask' required>
                          <input type="submit" class="addTask" value="Add task">
                      </form>
                      <div class="listTask">${listTasks}</div>
                  </div>`
                  })
                  document.getElementById('putRoom').innerHTML = display
              })

  }

  const getAllUsers = (e) => {
    e.preventDefault()
      fetch('/api/users')


          .then(r => r.json())
          .then(data => {
              console.log(data)
              // getElementById("users").innerHTML
              // const listUsers = users.map((user) => `<option id="${user._id}">${user.username}</option>`).join(' ')
              

          })
  }
  const addUserToRoom = (e) => {
      e.preventDefault()

      console.log(e)
      const roomID = e.target.id
      const choosenUser = document.querySelector('#users').value

      console.log(choosenUser, roomID)
      fetch('/api/users', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  roomID,
                  choosenUser
              })
          }).then(r => r.json())
          .then(data => {
              console.log(data)
              getAllRooms()

          })
  }








  // // SHOW SINGEL ROOM

  //   onClickRoom = (e) => {
  //       let showRoom = ''
  //       console.log("room clickd")

  //       fetch("/api/allrooms")
  //           .then(r => r.json())
  //           .then(data => {
  //               data.rooms.forEach(room => {
  //                   const listTasks = room.notes.map((task) => `<div>${task}
  //                       <button id="${room._id}" name="${task}" class="deleteTask"
  //                           onclick="handleDeleteTask(event)">Done</button>
  //                   </div>`).join(' onClickRoom')

  //                   showRoom += `<div class="body">
  //                       <div class="back">
  //                           <a href="/rooms.html"><img src="icons/back.svg"></a>
  //                       </div>

  //                       <div>
  //                           <h1>${room.roomName}</h1>
  //                       </div>
  //                       <div class="notes">
  //                           ${listTasks}
  //                       </div>
  //                   </div>`
  //               })
  //               document.getElementById('singelRoom').innerHTML = showRoom
  //           })

  //   }


  //-----DELETE ROOM-------//
  handleDeleteRoom = (e) => {
      e.preventDefault()
      const roomId = e.target.id
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

  //-----CREATE ROOM-------//
  hendleCreateRoom = (e) => {
      e.preventDefault()
      const roomName = e.target.children.roomName.value
      const room = document.getElementById('putRoom')
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

              getAllRooms()
          })
  }

  //-----CREATE TASK-------//
  handleAddTask = (e) => {
      e.preventDefault()
      const createTask = e.target.children.newTask.value
      const roomId = e.target.id

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
  handleDeleteTask = (e) => {
      e.preventDefault()
      const roomId = e.target.id
      const deleteTask = e.target.name

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

  document.addEventListener('DOMContentLoaded', getAllRooms());


