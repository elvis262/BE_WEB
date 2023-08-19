require('dotenv').config()
const { PrismaClient } = require('@prisma/client') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const prisma = new PrismaClient()

async function gtDoctor(email){
    
    const inspector = await prisma.doctor.findUnique({
        where :{
            mail: email
        }
    })
    return inspector
}

exports.login = async  (req, res, next)=>{
    const {email, password} = req.body
    gtDoctor(email) 
    .then(async (doctor) => {
        await prisma.$disconnect()
        if(!doctor) return res.status(401).json({message : "Votre Email ou votre mot de passe est incorrect"})
        bcrypt.compare(password, doctor.password)
        .then(valid =>{
            if(!valid) return res.status(401).json({message : "Votre Email ou votre mot de passe est incorrect"})
            const token = jwt.sign({
                id: doctor.id,
                email: doctor.mail
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h',algorithm:'HS256'}
            )
            
            res.cookie('token', token,{httpOnly: true})
            res.redirect('/doctor/dashboard')
 
        })
        .catch(err => {
            res.status(500).json({err})
        })
    })
    .catch(async (err) => {
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}

exports.dashboard = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../Frontend/Doctor/index.html'))
}