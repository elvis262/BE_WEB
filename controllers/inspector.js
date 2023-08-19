require('dotenv').config()
const { PrismaClient } = require('@prisma/client') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const path = require('path')

async function gtInspector(email){
    
    const inspector = await prisma.inspector.findUnique({
        where :{
            mail: email
        }
    })
    return inspector
}

exports.login = async  (req, res, next)=>{
    const {email, password} = req.body

    gtInspector(email) 
    .then(async (inspector) => {
        await prisma.$disconnect()
        if(!inspector) return res.status(401).json({message : "Votre Email ou votre mot de passe est incorrect"})
        bcrypt.compare(password, inspector.password)
        .then(valid =>{
            if(!valid) return res.status(401).json({message : "Votre Email ou votre mot de passe est incorrect"})
            const token = jwt.sign({
                id: inspector.id,
                email: inspector.mail
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h',algorithm:'HS256'}
            )
            
            res.cookie('token', token,{httpOnly: true})
            res.redirect('/inspector/dashboard')
            
        })
        .catch(err => {
            res.status(500).json({err})
        })
    })
    .catch(async (e) => {
        console.error(e)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}

exports.dashboard = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../Frontend/Inspector/index.html'))
}