const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()


const createConsultation  = async (consulation) =>{
    const result = prisma.consultation.create({
        data : consulation
    })
    return result
}

const addStudentJt = async (student) =>{
    const result = prisma.student.update({
        where:{id: student.id},
        data:{
            justifiedTime:{
                increment: student.jt
            }
        }
    })
    return result
}
const getInspector = async (studentId)=>{
    const result = await prisma.student.findUnique({
        where:{id: studentId},
        select:{
            sector:{
                select:{
                    inspector:{
                        select:{mail:true}
                    }
                }
            }
        }
    })
    return result
}

module.exports = (io)=>{
    io.on('connection', (socket)=>{
        socket.on('newConsultation', (param)=>{
            const {diagnostic, restDuration,studentId} = param
            const date = new Date()
            const {userId} = socket.auth
            param[date] = date.toLocaleString('fr-FR')
            delete param.studentId

            createConsultation({student: { connect: { id: parseInt(studentId) } }, restDuration: restDuration, diagnostic: diagnostic, date: date.toLocaleString('fr-FR'),doctor: { connect: { id: parseInt(userId) } }})
            .then(async (consultation) =>{
                addStudentJt({id:parseInt(studentId),jt:restDuration})
                .then(async (student)=>{
                    getInspector(student.id)
                    .then(async (res)=>{
                        await prisma.$disconnect()
                        console.log(res.sector.inspector.mail)
                        if(consultation && student){
                            socket.emit('addSucced', true);
                            socket.broadcast.emit('modification', ({registration:param.studentRegistration, class: student.classId, restDuration: restDuration, inspectorEmail: res.sector.inspector.mail}))
                        }else{
                            socket.emit('addSucced', false)
                        }
                    })
                    
                })
                .catch(async (err)=>{
                    console.error(err)
                    await prisma.$disconnect()
                    socket.emit('addSucced', false)
                    process.exit(1)
                })
                
            }).catch(async (err)=>{
                console.error(err)
                await prisma.$disconnect()
                socket.emit('addSucced', false)
                process.exit(1)
            })
        })
    })
}
