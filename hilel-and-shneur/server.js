const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'))

const mongoose = require('mongoose');
const url = "mongodb+srv://myUser:gNRiLkhrwsFcHut6@cluster0.gt18p.mongodb.net/test";

let MemoList
let mongooseOK = false;
try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err==null) {
            MemoList = mongoose.model('room', {
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
    let status = req.body.checkBox
    console.log(status)

    if (req.body.checkBox == true) {
        checkIf = true
    } else {
        checkIf = false
    }

    await MemoList.findByIdAndUpdate(dataID, { status: checkIf })

    const data = await MemoList.find({})
    res.send({ data })
})


app.get('/onPageLoad', async (req, res) => {
    const data = await MemoList.find({})
    res.send({ data })
})

app.post('/deleteroom', async (req, res) => {
    const { dataID } = req.body
    await MemoList.findByIdAndDelete(dataID)
    const data = await MemoList.find({})
    res.send({ data })
})

app.post('/sendRoom', async (req, res) => {
    
    if (mongooseOK == false) {
        res.send({ Result: 'Error', Message: 'Mongoose not connected' })
        return false;
    }
    const { memo, room, } = req.body


    if (memo.length > 0) {
        const newRoom = new MemoList({ memo, room, status: 'false' })
        await newRoom.save()
            .then(doc => {
            })
            .catch(e => {
                console.log('ER:' + e)
            })
        const data = await MemoList.find({})
        res.send({ data })
    }
    else {
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('server MemoListen on port ', port))
