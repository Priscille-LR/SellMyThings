//logique métier dans les controllers

const Thing = require('../models/thing')

//package fs expose des méthodes pour interagir avec le système de fichiers du serveur
const fs = require('fs') //node file system operations

//mise a jour de la requete post 
//Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, 
//et non sous forme de JSON. Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne. 
//=> analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.

//résoudre l'URL complète de l'image, car req.file.filename ne contient que le segment filename 
//req.protocol pour obtenir le premier segment (ici 'http' ) + req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
//on ajoute '/images/' et le nom de fichier pour compléter notre URL.
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing) //extraire objet json du thing
    delete thingObject._id
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    thing.save()
        .then(() => res.status(201).json({ message: 'objet enregistré' }))
        .catch(error => res.status(400).json({ error }))
}

exports.updateThing = (req, res, next) => {
    //crée un objet thingObject qui regarde si req.file existe ou non
    const thingObject = req.file ? { //si on trouve un fichier => parse objet et modifie image url (traite new image)
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body } //sinon, on traite l'objet entrant
    //1er arg = on modifie l'objet dont l'id = id dans les params
    //2e arg = nouvelle version de l'objet: récup thing dans le corps de la requete; id corresp à celui des params (celui dans le body est peut-etre pas bon)

    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id }) //modifie id pour corresp a celui des params de requete
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }))
}

//récup thing dans la base et vérifie qu'il appartient bien à la personne qui veut faire la suppression
//=> seul le propriétaire d'un thing peut le supprimer
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id }) //trouve thing dans DB
        .then(thing => {
            if (!thing) {
                return res.status(404).json({ error: new Error('objet non trouvé') }) //
            }
            if (thing.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('requete non autorisée') }) //
            }
            const filename = thing.imageUrl.split('/images/')[1] //extrait le nom de fichier a supprimer
            fs.unlink(`images/${filename}`, () => { //unlink => supprimer fichier, puis dans callback fs.unlink => supprimer thing
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprimé' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))

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