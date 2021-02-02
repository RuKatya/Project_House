//---------CORRECT TIME-------//
function getTime() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let time = `${hours}:${minutes}:${seconds}`;
  document.getElementById("correctTime").innerHTML = time;
}
setInterval(getTime, 0);

//---------CORRECT DATE---------//
function getDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  let dateToday = `${day}/${month}/${year}`;
  document.getElementById("correctDate").innerHTML = dateToday;
}
setInterval(getDate, 0);


//-----CHECK ADMIN-------//

const checkAdmin = async () => {
  let admin = false;
  await fetch("/api/checkadmin")
    .then((res) => res.json())
    .then((data) => {
      if (data.admin) {
        admin = true;
      } else {
        admin = false;
      }
    });
  return admin;
};

const getUsersPage = async () => {
  let checkAdmin = await checkAdmin();
  if(checkAdmin){
     document.querySelector('.wrapperAdmin').style.display = 'none';
  }
}

 
//-----RENDER ROOMS PAGE-------//

getAllRooms = async (rooms) => {
  let display = "";
  await fetch("/api/allrooms")
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      setRoomsOnPage(data.rooms);
    });
};

setRoomsOnPage =  (rooms) => {

  const data = rooms.map(room => {
    const listTasks = room.notes
      .map(
        (task) => `<div>${task}
        <button id="${room._id}" name="${task}" class="deleteTask"
            onclick="handleDeleteTask(event)">Done</button>
    </div>`
      )
      .join(" ");

      const listUsers = room.assignUsers
      .map(
        (user) => `<div>${user.nameUser}
        <button id="${room._id}" name="${user.userId}" value="${user.nameUser}" class="deleteUser"
            onclick="handleDeleteUser(event)">delete</button>
    </div>`
      )
      .join(" ");

    const roomData = `<div class="roomsAndTask">
        <div class="gridHeadline">
            <h3>${room.roomName}</h3> 

            <select id="${room._id}" class="usersSelector"> 
           
        </select>
        
        <button id="${room._id}" onclick="handleDeleteRoom(event)" class="deleteRoom">Delete
        room</button>

        <button id="${room._id}" onclick="addUserToRoom(event)" >add user to this room</button>
        <div class="listUsers">${listUsers}</div>
       

          
        </div>
        <form id="${room._id}" class="formTask" onsubmit='handleAddTask(event)'>
            <input class="newTask" type='text' placeholder="add task" name='newTask' required>
            <input type="submit" class="addTask" value="Add task">
        </form>
        <div class="listTask">${listTasks}</div>
    </div>`;

    return roomData;
  });

  document.getElementById("putRoom").innerHTML = data;
  getAllUsers();
 
};

const getAllUsers = (e) => {
  fetch("/api/users")
    .then((r) => r.json())
    .then((data) => {
    //   data.users.forEach((user) => {
    //     document.getElementsByClassName(
    //       "users"
    //     ).innerHTML += `<option id="${user._id}">${user.username}</option>`;

    //     const userList = user.username;
    //     console.log(userList);
    //   });
      // users = [...data.users];
      setUsersOnPage(data.users)
    });
  // return users;
};

const setUsersOnPage =(users) => {
const usersOptions = users.map(user => `<option value="${user._id}" id="${user._id}">${user.username}</option>`)
usersOptions.unshift(`<option selected value = "Select user" style="display: none">Select user </option>`)
const selectors = document.getElementsByClassName('usersSelector');
console.log(selectors)
for (const selector of selectors) {
    selector.innerHTML = usersOptions.join(' ');
    
}
}

const addUserToRoom = (e) => {
  e.preventDefault();
  
  console.log(e);
  const roomID = e.target.id;
  const selectedIndex = document.getElementById(`${roomID}`).options.selectedIndex
  const userId = document.getElementById(`${roomID}`).options[selectedIndex].value
  const nameUser = document.getElementById(`${roomID}`).options[selectedIndex].text
  console.log(nameUser)
  console.log(selectedIndex)
  console.log(userId, roomID);
  fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomID,
      userId,
      nameUser
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      getAllRooms();
   
    });
};


const handleDeleteUser = (e) => {
  e.preventDefault();
  const userId = e.target.name;
  const roomId = e.target.id
  const nameUser = e.target.value
 

  fetch("/api/deleteuser", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
      roomId,
      userId,
      nameUser
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      getAllRooms();
    });
};


// getElementById("users").innerHTML
// const listUsers = users.map((user) => `<option id="${user._id}">${user.username}</option>`).join(' ')

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
  e.preventDefault();
  const roomId = e.target.id;
  fetch("/api/deleteroom", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      getAllRooms();
    });
};

//-----CREATE ROOM-------//
hendleCreateRoom = (e) => {
  e.preventDefault();
  const roomName = e.target.children.roomName.value;
  const room = document.getElementById("putRoom");
  fetch("/api/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomName,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      getAllRooms();
    });
};

//-----CREATE TASK-------//
handleAddTask = (e) => {
  e.preventDefault();
  const createTask = e.target.children.newTask.value;
  const roomId = e.target.id;

  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      createTask,
      roomId,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      getAllRooms();
    });
};

//-----DELETE TASK-------//
handleDeleteTask = (e) => {
  e.preventDefault();
  const roomId = e.target.id;
  const deleteTask = e.target.name;

  fetch("/api/deletenotes", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deleteTask,
      roomId,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      getAllRooms();
    });
};

document.addEventListener("DOMContentLoaded", getAllRooms());

