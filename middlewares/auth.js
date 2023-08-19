require('dotenv').config()
const jwt = require("jsonwebtoken") 
const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()

const verifyUser = async (token,origin)=>{
    if((origin === '/doctor/dashboard' || origin === '/connexion/doctor')){
        console.log('doctor')
        return await prisma.doctor.findUnique({
            where:{id:token.id}
        })
    }else if((origin === '/inspector/dashboard' || origin === '/connexion/inspector')){
        console.log('inspector')
        return await prisma.inspector.findUnique({
            where:{id:token.id}
        })
    }
}

exports.authentification = (socket, next)=>{
   
    try{
        
        console.log( socket.handshake.headers.cookie.split('token='))
        const decodedToken = jwt.verify(socket.handshake.headers.cookie.split('token=')[1], process.env.JWT_SECRET)
        const origin = socket.handshake.headers.referer.split('http://localhost:8080')[1]
        verifyUser(decodedToken,origin)
        .then( async (user) =>{
            await prisma.$disconnect()
            if(user){
                socket.auth ={
                    userId: user.id,
                    userEmail: user.mail
                }
                
                next()
            }else{
                socket.emit('authentificationFailed',{message: 'Authentification  échouée'});
            }
        })
        .catch(async (err)=>{
            console.error(err)
            socket.emit('authentificationFailed',{message: 'Une erreur s\'est produite'});
            await prisma.$disconnect()
            process.exit(1)
        })
        
    }catch (error) {
        socket.emit('authentificationFailed',{message: 'Authentification  échouée'});
    }
}


exports.auth = (req, res, next) =>{
    try {
        const origin = req.headers.referer.split('http://localhost:8080')[1]

        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        console.log(decodedToken)
        verifyUser(decodedToken,origin)
        .then( async (user) =>{
            await prisma.$disconnect()
            if(user){
                req.auth = {
                    userId : decodedToken.id,
                    userEmail: decodedToken.email
                }
                next()
            }else{
                if(origin === '/doctor/dashboard'){
                    res.redirect('/doctor/login')
                }else if(origin === '/inspector/dashboard'){
                    res.redirect('/inspector/login')
                }else res.status(404).json({message: 'Bêlêlou!!!!!!!!🤣🤣🤣🤣'})
            }
        })
        .catch(async (err)=>{
            console.error('le problème !!!',err)
            res.status(500).json({err})
            await prisma.$disconnect()
            process.exit(1)
        })
        
    } catch (error) {
        res.status(401).json({ error });
    }
    
}
