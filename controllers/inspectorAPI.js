require('dotenv').config()
const { PrismaClient } = require('@prisma/client') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()


const getClasses = async (inspectorId)=>{
    const result = await prisma.sector.findUnique({
        where:{inspectorId: inspectorId},
        select:{classes:{
            select:{id:true,libelle:true,
            students:{
                select: {
                  name: true,
                  registration: true,
                  justifiedTime: true,
                  photo: true
                },
                orderBy: {
                  name: 'desc'
                }
              }}
        }}
    })
    const all = await prisma.sector.findUnique({
        where:{inspectorId: inspectorId},
        select:{
            students:{
                select:{name:true,registration:true,photo:true,justifiedTime:true,class:{
                    select:{libelle:true}
                }},
                orderBy:{name: 'desc'}
            }
        }  
    })
    return {classes: result, allStudents:all}
}
exports.classes = (req, res, next)=>{
    const {userId} = req.auth
    getClasses(userId)
    .then(async (data)=>{
        await prisma.$disconnect()
        if(data){
            const temp = data.classes.classes.map(dt=>{
                const {libelle} = dt
                dt.students = dt.students.map(student=>{
                    student['class'] = {libelle:libelle}
                    student.class.libelle = libelle
                    return student
                })
                return dt
            })
            data.classes.classes = temp
            res.status(200).json(data)
        }else{
            res.redirect('/connexion/inspector')
        }
    })
    .catch(async (e) => {
        console.error(e)
        res.status(500).json({e})
        await prisma.$disconnect()
        process.exit(1)
    })
}
/*---------------------------------------------------- */
const getAllStudent = async (inspectorId)=>{
    const result = await prisma.sector.findUnique({
        where:{inspectorId: inspectorId},
        select:{
            students:{
                select:{name:true,registration:true,photo:true,justifiedTime:true,classId:true}
            }
        }
    })
    return result
}

exports.allStudent = (req, res, next)=>{
    const {userId}= req.auth
    getAllStudent(userId)
    .then(async (students)=>{
        await prisma.$disconnect()

        res.status(200).json(students)
       
    })
    .catch(async (e) => {
        console.error(e)
        res.status(500).json({err})
        await prisma.$disconnect()
        process.exit(1)
    })
}

/*--------------------------------------------------------*/
const updateJT = async (registration, time)=>{
    const result = await prisma.student.update({
        where: {registration: registration},
        data: {justifiedTime: time}
    })
    return result
}

exports.updateStudentJustifiedTime = (req, res, next) =>{
    const {_matricule,_time} = req.query

    if(parseInt(_time) && _matricule.trim() !==''){
        updateJT(_matricule,parseInt(_time))
        .then(async (student)=>{
            await prisma.$disconnect()
            if(student){
                res.status(200).json({message: 'Modification réussie'})
            }else{
                res.status(401).json({message: 'Echec de la modification'})
            }
        }).catch(async (e) => {
            console.error(e)
            res.status(500).json({e})
            await prisma.$disconnect()
            process.exit(1)
        })
    }else{
        res.status(401).json({message: 'Echec de la modification'})
    }
}

/*------------------------------------------------------*/

const getStudentConsultation = async (registration)=>{
    const result = await prisma.student.findUnique({
        where:{registration: registration},
        select:{
            consultations:{
                select:{
                    id          :true,
                    restDuration:true,          
                    date        :true,     
                    diagnostic  :true,     
                    studentId   :true,      
                    doctorId    :true,
                    doctor:{
                        select:{name:true,mail:true}
                    } 
                },
                orderBy:{id:'desc'}
                        
            }

        }
    })
    return result
}

exports.studentConsultations = (req, res, next)=>{
    const {_matricule} = req.query
    if(_matricule){
        getStudentConsultation(_matricule)
        .then(async (consultations)=>{
            await prisma.$disconnect()
                res.status(200).json(consultations)
        }).catch(async (e) => {
            console.error(e)
            res.status(500).json({e})
            await prisma.$disconnect()
            process.exit(1)
        })
    }else{
        res.status(401).json({message: 'Echec de la recherche'})
    }
}

/*-------------------------------------------------------------------*/
const getclassStudents = async (classId)=>{
    const result = await prisma.class.findUnique(
        {
            where: {id: classId},
            select:{students: true}
        }
    )
    return result
}

exports.classStudents = (req,res,next)=>{
    const {classId} = req.query
    classId = parseInt(classId)
    getclassStudents(classId)
    .then(async (students)=>{
        await prisma.$disconnect()
        res.status(200).json(students)
    })
    .catch(async (e)=>{
        console.error(e)
        res.status(500).json({e})
        await prisma.$disconnect()
        process.exit(1)
    })
}