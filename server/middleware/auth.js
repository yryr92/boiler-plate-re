const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리 하는 곳

    // 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    // 토큰을 복호화하여 user를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();

    })

    // user가 있으면 인증완료

    // user가 없으면 인증 no



}

module.exports = {auth};