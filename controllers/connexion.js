const path = require('path')

exports.doctor = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../Frontend/Login/doctor.html'))
}
exports.inspector = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../Frontend/Login/inspector.html'))
}
exports.disconnect = (req,res,next)=>{
    const origin = req.headers.referer.split('http://localhost:8080')[1]
    const {userId} = req.auth
    if(origin === '/doctor/dashboard'){
        res.clearCookie('token_d'+userId, { httpOnly: true });
        res.redirect('/connexion/doctor')
    }else if(origin === '/inspector/dashboard'){
        res.clearCookie('token_i'+userId, { httpOnly: true });
        res.redirect('/connexion/inspector')
    }
}