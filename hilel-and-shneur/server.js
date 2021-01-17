const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'))

const mongoose = require('mongoose');
const url = "mongodb+srv://myUser:gNRiLkhrwsFcHut6@cluster0.gt18p.mongodb.net/test";

let list
let mongooseOK = false;
try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err==null) {
            list = mongoose.model('room', {
                memo: String,
                room: String,
                status: String,
              
            })
            mongooseOK = true
        }
    });
} catch (error) {
    console.log("mongoose connect error: " + error.message)
}


app.post('/checkIf', async (req, res) => {
    const { dataID } = req.body

    if (req.body.checkBox == true) {
        checkIf = true
    } else {
        checkIf = false
    }

    await list.findByIdAndUpdate(dataID, { status: checkIf })

    const data = await list.find({})
    res.send({ data })
})


app.get('/onPageLoad', async (req, res) => {
    const data = await list.find({})
    res.send({ data })
})

app.post('/deleteroom', async (req, res) => {
    const { dataID } = req.body
    await list.findByIdAndDelete(dataID)
    const data = await list.find({})
    res.send({ data })
})

app.post('/sendRoom', async (req, res) => {
    
    if (mongooseOK == false) {
        res.send({ Result: 'Error', Message: 'Mongoose not connected' })
        return false;
    }
    const { memo, room, } = req.body


    if (memo.length > 0) {
        const newRoom = new list({ memo, room, status: 'false' })
        await newRoom.save()
            .then(doc => {
            })
            .catch(e => {
                console.log('ER:' + e)
            })
        const data = await list.find({})
        res.send({ data })
    }
    else {
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('server listen on port ', port))
