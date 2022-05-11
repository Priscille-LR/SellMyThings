//crée schéma de données

const mongoose = require('mongoose')

const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
})

//pouvoir exploiter schema comme modele de données
module.exports = mongoose.model('Thing', thingSchema)


