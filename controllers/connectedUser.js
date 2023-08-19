const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()

const getConnectedUser = async (user,origin)=>{
    if(origin === '/doctor/dashboard' || origin === '/connexion/doctor'){
        return await prisma.doctor.findUnique({
            where:{id:user.userId}
        })
    }else if((origin === '/inspector/dashboard' || origin === '/connexion/inspector')){
        return await prisma.inspector.findUnique({
            where:{id:user.userId},
            select:{name:true,mail:true}
        })
    }
}


exports.connectedUser = (req,res,next)=>{
    const origin = req.headers.referer.split('http://localhost:8080')[1]
    getConnectedUser(req.auth,origin)
    .then(async (user)=>{
        await prisma.$disconnect()
        res.status(200).json(user)
    }).catch(async (err)=>{
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}