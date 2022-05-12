//déporter logique des routes dans un ficher routeur séparé

const express = require('express')
const router = express.Router()
const stuffCtrl = require('../controllers/stuff')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, stuffCtrl.createThing);

router.put('/:id', auth, multer, stuffCtrl.updateThing)

router.delete('/:id', auth, stuffCtrl.deleteThing)

router.get('/:id', auth, stuffCtrl.getOneThing);

router.get('/', auth, stuffCtrl.getThings);

module.exports = router