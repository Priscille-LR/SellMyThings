const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

//const storage à passer a Multer comme config
//destination => indique d'enregistrer les fichiers dans le dossier images
//filename =< indique d'utiliser le nom d'origine; utilise const dictionnaire mime type pour résoudre l'extension de fichier
const storage = multer.diskStorage({ //configure le chemin et le nom de fichier pour les fichiers entrants
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_') //enlever les espaces dans le nom et les remplacer par des _
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

//exporte multer entièrement configuré, passe const storage et lui indique 
//que uniquement les téléchargements de fichiers image seront gérés
module.exports = multer({ storage }).single('image')