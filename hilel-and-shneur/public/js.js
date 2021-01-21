onPageLoad()

function mysubmit(event) {
    event.preventDefault()
    const memo = event.target.children.memo.value
    const room = document.querySelector('#roomList').value
    
    fetch("/createRoom", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            body: JSON.stringify({
                memo,
                room,
                
            })
        })
        .then(a => a.json())
        .then(DBinfo => {
            printData(DBinfo.data)
        })
}

function deleteRoom(e) {
    const dataID = e.target.dataset.id

    fetch("/deleteRoom", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dataID
            })
        })
        .then(a => a.json())
        .then(data => {
            printData(data.data)
        })
}

function onPageLoad() {
    fetch("/onPageLoad")
        .then(a => a.json())
        .then(data => {
            printData(data.data)
        })
}

function statusRoom(event) {
    const checkBox = event.target.checked
    const dataID = event.target.dataset.id

    fetch("/checkIf", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                checkBox,
                dataID
            })
        })
        .then(a => a.json())
        .then(data => {
            printData(data.data)
        })
}

const room1 = document.querySelector('.room1')
const room2 = document.querySelector('.room2')
const room3 = document.querySelector('.room3')
const room4 = document.querySelector('.room4')

function printData(data) {
    room1.innerHTML = ''
    room2.innerHTML = ''
    room3.innerHTML = ''
    room4.innerHTML = ''

    for (i = 0; i < data.length; i++) {

        let style = 'rgba(181, 209, 200, 0.562);opacity:0.4;color:grey'

        if (data[i].status == 'true') {
            let style = 'rgba(181, 209, 200, 0.562);opacity:0.4;color:grey'
            let checkBox = 'checked="true"'
            mmm(data, style, checkBox )
        } else {
            let style = 'rgba(181, 209, 200, 0.562)'
            let checkBox = `dataset="false"`
            mmm(data, style, checkBox )

        }

        function mmm(data, style, checkBox) {
            
            let img = `<img src="img/icons8-close-window-100.png" onclick="deleteRoom(event)"`

            if (data[i].room == 'b') {
                room1.innerHTML += `<div class="lists" style='${style}'>
                <input type="checkbox" ${checkBox} onclick="statusRoom(event)"data-id="${data[i]._id}">
                <div class="list">${data[i].memo}</div>${img}  data-id="${data[i]._id}"></div>`
            } else if (data[i].room == 'c') {
                room2.innerHTML += `<div class="lists" style='${style}'>
                <input type="checkbox" ${checkBox} onclick="statusRoom(event)"data-id="${data[i]._id}">
                <div class="list">${data[i].memo}</div>${img}  data-id="${data[i]._id}"></div>`
            } else if (data[i].room == 'd') {
                room3.innerHTML += `<div class="lists" style='${style}'>
                <input type="checkbox" ${checkBox} onclick="statusRoom(event)"data-id="${data[i]._id}">
                <div class="list">${data[i].memo}</div>${img}  data-id="${data[i]._id}"></div>`
            } else if (data[i].room == 'e') {
                room4.innerHTML += `<div class="lists" style='${style}'>
                <input type="checkbox" ${checkBox} onclick="statusRoom(event)"data-id="${data[i]._id}">
                <div class="list">${data[i].memo}</div>${img}  data-id="${data[i]._id}"></div>`
            }
        }

    }
}