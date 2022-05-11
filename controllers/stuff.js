//logique métier dans les controllers

const Thing = require('../models/thing')

exports.createThing = (req, res, next) => {
    delete req.body._id
    const thing = new Thing({
        ...req.body
    })
    thing.save()
        .then(() => res.status(201).json({ message: 'objet enregistré' }))
        .catch(error => res.status(400).json({ error }))
}

exports.updateThing = (req, res, next) => {
    //1er arg = on modifie l'obje dont l'id = id dans les params
    //2e arg = nouvelle version de l'objet: récup thing dans le corps de la requete; id corresp à celui des params (celui dans le body est peut-etre pas bon)
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet supprimé' }))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }))
}

exports.getThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))
}