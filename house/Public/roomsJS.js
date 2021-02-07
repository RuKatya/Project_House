var isAdmin = false
var userId 

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


async function checkAdmin() {
  let admin = false;
    await fetch("/api/checkadmin")
    .then((res) => res.json())
    .then((data) => {
  admin = data.admin
       });
  return admin;
  };

  async function checkUserId() {
   
    await fetch("/api/getUserId")
      .then((res) => res.json())
      .then((data) => {
        userId = data.userId
        console.log(userId)
        console.log('2')
         });
    return userId;
    };

    


  
 
//-----RENDER ROOMS PAGE-------//

/* const getUsersPage = async () => {
  let checkAdmin = await checkAdmin();
  console.log(checkAdmin)
   if (checkAdmin){
     document.querySelector('.wrapperAdmin').style.display = 'none';
  }
  
}  */

getAllRooms = async (rooms) => {
  console.log('3')
  await fetch("/api/allrooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      isAdmin
    }),
  })
    .then((r) => r.json())
    .then((data) => {
    console.log(data)
      
      setRoomsOnPage(data.rooms);
    
    });
};


setRoomsOnPage = async (rooms) => {
  console.log(isAdmin)
  console.log(userId)
  const data = rooms.map(room => {
    const listTasks = room.notes
      .map(
        (task) => `<div class='tasks' id='${task}'>${task}
        <button id="${room._id}" name="${task}" class="deleteTask"
            onclick="handleDeleteTask(event)"></button>
        <button class='mark__btn' id='mark${task}' name='${task}' onclick="handleMarkTask(event)"></button>
        <button class='unmark__btn' id='unmark${task}' name='${task}' style="display: none;" onclick="handleUnmarkTask(event)"></button>
        
    </div>`
      )
      .join(" ");

    const listUsers = room.assignUsers
  
      .map(
        (user) => `<div class="userName">${user.nameUser}
        <button id="${room._id}" name="${user.userId}" value="${user.nameUser}" class="deleteUser"
            onclick="handleDeleteUser(event)"></button>
    </div>`
      )
      .join(" ");

    const roomData = `<div class="roomsAndTask">
        <div class="gridHeadline">
            <h3>${room.roomName}</h3> 
            <div class='addUser__wrapper'>
            <div class='addUser__btns'><select id="${room._id}" class="usersSelector"> </select>
            <button class="add__btn" id="${room._id}" onclick="addUserToRoom(event)" >Add</button></div>
            
            <div class="listUsers">${listUsers}</div>
            </div>
        
        <button id="${room._id}" onclick="handleDeleteRoom(event)" class="deleteRoom">Delete</br>room</button>
        
       
       

          
        </div>
        
        <form id="${room._id}" class="formTask" onsubmit='handleAddTask(event)'>
            <input class="newTask" type='text' placeholder="Add task" name='newTask' required>
            <button type="submit" class="addTask" value="Add task">Add task</button>
        </form>
        <div class="listTask">${listTasks}</div>
    </div>`;
   
    return roomData;
  }).join(' ');

  document.getElementById("putRoom").innerHTML = data;
  getAllUsers();
  
    if (isAdmin == false){
      document.getElementById('titleCreateRoom').style.display = 'none';
      document.getElementById('roomName').style.display = 'none';
      document.getElementById('btnCreateRoom').style.display = 'none';
     
      const addUser__btns = document.getElementsByClassName("addUser__btns");
      for (let wrapperBtns of addUser__btns) {
          console.log(wrapperBtns);
          wrapperBtns.style.display='none'
      }
     
      const btnDeleteRoom = document.getElementsByClassName("deleteRoom");
      for (let btnDelete of btnDeleteRoom) {
          console.log(btnDelete);
          btnDelete.style.display='none'
      }

      const btnDeleteUser = document.getElementsByClassName("deleteUser");
      for (let btnDelete of btnDeleteUser) {
          console.log(btnDelete);
          btnDelete.style.display='none'
      }

      const listTask = document.getElementsByClassName("listTask");
      console.log(listTask)
      for (let listTasksUsers of listTask) {
          listTasksUsers.style.cssText=`height: 15vh;
          margin: 40px 0px 20px 0px`
         
      }
    }
  
 
};


getUsersPage = () => {
  console.log(isAdmin)
  if (isAdmin = false){
    const wrapperAdmin = document.getElementsByClassName('wrapperAdmin')
    console.log(wrapperAdmin)
    wrapperAdmin.style.display = 'none';
    
  }
}



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

const setUsersOnPage = (users) => {
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
 
 
  fetch("/api/addusers", {
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
  console.log(roomName)
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

function handleMarkTask(e) {

  const textTask = e.target.name
  console.log(textTask)
  document.getElementById(`mark${textTask}`).style.display='none'
  
  document.getElementById(`unmark${textTask}`).style.display='inline'

  let task = document.getElementById(`${textTask}`);
  console.log(task)
  task.style.textDecoration = 'line-through';
}

function handleUnmarkTask(e) {

  const textTask = e.target.name
  console.log(textTask)
  document.getElementById(`mark${textTask}`).style.display='inline'
  
  document.getElementById(`unmark${textTask}`).style.display='none'

  let task = document.getElementById(`${textTask}`);
  console.log(task)
  task.style.textDecoration = 'none';
}

document.addEventListener('DOMContentLoaded', async (event) => {
  await checkAdmin().then((localIsAdmin) => {isAdmin = localIsAdmin}),  await checkUserId().then((localUserId) => {userId = localUserId}), await getAllRooms();
  console.log(isAdmin)
  console.log(userId)
});
