const express = require('express')
const path = require('path')
const {login,dashboard} = require('../controllers/doctor')
const {auth} = require('../middlewares/auth')
const router = express.Router();
router.use(express.static(path.join(__dirname, '../Frontend/Doctor')))


router.post('/login', login);
router.get('/dashboard',auth,dashboard)


module.exports = router;