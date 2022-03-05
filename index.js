const express = require('express')
const app = express()
const port = 5000
const { User } = require("./models/User");
const bodyParser = require('body-parser');

//application/x-www-form-urelencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ychoi:ychoi1234@cluster0.ylal6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))

//mongodb+srv://ychoi:<password>@cluster0.ylal6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

app.get('/', (req, res) => {
  res.send('Hello World! heyhey')
})

app.post('/register', (req, res) => {

  // 회원가입시 필요한 정보들을 client에서 가져오기 위해 db에 넣어주기
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})