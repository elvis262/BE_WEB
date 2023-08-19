const express = require('express')
const path = require('path')
const {login,dashboard} = require('../controllers/inspector')
const {auth} = require('../middlewares/auth')
const router = express.Router();
router.use(express.static(path.join(__dirname, '../Frontend/Inspector')))

router.post('/login',login);
router.get('/dashboard',auth,dashboard)


module.exports = router;