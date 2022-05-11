//déporter logique des routes dans un ficher routeur séparé

const express = require('express')
const router = express.Router()
const stuffCtrl = require('../controllers/stuff')

router.post('/', stuffCtrl.createThing);

router.put('/:id', stuffCtrl.updateThing)

router.delete('/:id', stuffCtrl.deleteThing)

router.get('/:id', stuffCtrl.getOneThing);

router.get('/', stuffCtrl.getThings);

module.exports = router