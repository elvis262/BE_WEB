const express = require('express')
const path = require('path')
const {doctor,inspector,disconnect} = require('../controllers/connexion.js')
const {auth} = require('../middlewares/auth')
const router = express.Router();

router.use(express.static(path.join(__dirname, '../Frontend/Login')))
router.get('/doctor',doctor)
router.get('/inspector',inspector)
router.get('/disconnect',auth,disconnect)

module.exports = router;