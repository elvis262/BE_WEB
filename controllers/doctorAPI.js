const { PrismaClient } = require('@prisma/client') 
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

const getConsultation = async (id)=>{
    const date = new Date()
    const consultation = await prisma.consultation.findMany(
        {
            where: {doctorId: id, date: {
                contains: date.toLocaleDateString('fr-Fr')
            }},
            select:{
                restDuration:true,date:true,diagnostic:true,
                student:{
                    select:{id:true,name:true,photo:true,registration:true},
                    select:{ name:true,photo:true,registration:true,
                        class:{
                            select:{libelle:true}
                        },
                        school:{
                            select:{libelle:true}
                        }
                    }
                }
            },
            orderBy:{id:'desc'}
        }
    )
    return consultation
}
exports.consultation = (req, res, next)=>{
    const {userId} = req.auth
    getConsultation(userId)
    .then(async (consultations )=> {
        await prisma.$disconnect()
        res.status(200).json(consultations)
    }).catch(async (err)=>{
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}
/*--------------------------------------------------------------------*/
const getArchives = async (id,date)=>{
    
    const consultation = await prisma.consultation.findMany(
        {
            where: {doctorId: id, date:{
                contains: date
            }},
            include:{
                student:{
                    select:{id:true,name:true,photo:true,registration:true,
                        class:{
                            select:{libelle:true}
                        },
                        school:{
                            select:{libelle:true}
                        }
                    }
                }
            },
            orderBy:{id: 'desc'}
        }
    )
    return consultation
}
exports.gtConsultationArchive= (req, res, next)=>{
    const {_date} = req.query
    const {userId} = req.auth
    getArchives(userId,_date)
    .then(async (archives)=>{
        await prisma.$disconnect()
        res.status(200).json(archives)
    }).catch(async (err)=>{
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}
/*--------------------------------------------------------------------*/
const updatePassword = async (newPasseword, userID)=>{
    const result = await prisma.doctor.update({
        where:{id: userID},
        data:{
            password: newPasseword
        }
    })
    return result
}
exports.changePassword= (req, res, next)=>{

    const {newPasseword} = req.body
    const {userId} = req.auth
    bcrypt.hash(newPasseword,10)
    .then(hash=>{
        updatePassword(hash,userId)
        .then(async (doctor)=>{
            await prisma.$disconnect()
            if(doctor){
                res.status(200).json({message:'Enregistrement éffectué'})
            }else{
                res.status(401).json({message:'Qui êtes vous 🤨'})
                res.redirect('/connexion/doctor')
            }
        })
    }).catch(async (err)=>{
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}
/*-------------------------------------------------------------------*/
const searchStudent = async (matricule)=>{
    const result = await prisma.student.findUnique({
        where:{registration:matricule},       
        select:{id:true,name:true,photo:true,registration:true,
            class:{
                select:{libelle:true}
            },
            school:{
                select:{libelle:true}
            }
        }
                 
    })
    return result
}
exports.gtStudent= (req, res, next)=>{
    const {_matricule} = req.query
    searchStudent(_matricule)
    .then(async (student)=>{
        await prisma.$disconnect()
        res.status(200).json(student)
    }).catch(async (err)=>{
        console.error(err)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}
