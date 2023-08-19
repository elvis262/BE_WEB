const express = require('express')
const {auth} = require('../middlewares/auth')
const {connectedUser} = require('../controllers/connectedUser')
const {allStudent,classes,studentConsultations,updateStudentJustifiedTime,classStudents} = require('../controllers/inspectorAPI')
const router = express.Router();


router.get('/connectedUser',auth,connectedUser)
router.get('/students',auth,allStudent)
router.get('/classes',auth,classes)
router.get('/studentConsultations',auth,studentConsultations)
// router.get('/classStudents',auth,classStudents)
router.put('/studentJustifiedTime',auth,updateStudentJustifiedTime)
module.exports = router