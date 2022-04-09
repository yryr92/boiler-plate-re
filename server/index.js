const express = require('express')
const app = express()
const port = 5000
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key')

//application/x-www-form-urelencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))

//mongodb+srv://ychoi:<password>@cluster0.ylal6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

app.get('/', (req, res) => {
  res.send('Hello World! heyhey')
})

app.post('/api/users/register', (req, res) => {

  // 회원가입시 필요한 정보들을 client에서 가져오기 위해 db에 넣어주기
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })

})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email : req.body.email}, (err,user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다." 
      })
    }

    // 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
    })

    // Token 생성
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);

      // 토큰을 저장한다
      res.cookie("x_auth", user.token)
      .status(200)
      .json({loginSuccess: true, userId:user._id})

    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과했다는 것은 auth가 true라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    lastname:req.user.lastname,
    image: req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token:""},
    (err, user) => {
      if(err) return res.json({ success : false, err});
      return res.status(200).send({
        success: true
      })
    }
    )
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})