const express = require('express')
const {auth} = require('../middlewares/auth')
const {consultation,gtConsultationArchive,gtStudent} = require('../controllers/doctorAPI')
const {connectedUser} = require('../controllers/connectedUser')
const router = express.Router();

router.get('/connectedUser',auth,connectedUser)
router.get('/consultations',auth,consultation)
router.get('/archives',auth,gtConsultationArchive)
router.get('/consultation/student',auth,gtStudent)
module.exports = router