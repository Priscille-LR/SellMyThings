const jwt = require('jsonwebtoken')

//middleware d'authentification pour sécuriser les routes dans l'API. De cette façon, seules les requêtes authentifiées seront gérées.
//middleware vérifie le token envoyé par le front
//token valable et que le user id correspond bien à celui encodé dans le token

//étant donné que de nombreux problèmes peuvent se produire, => try...catch
//récup token du header Authorization de la requête entrante


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] //retourne ['bearer', 'token'] => on récupère ce dernier
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') //vérifie la validité d'un token (sur une requête entrante, par ex) => décode le token => erreur si non valide
        const userId = decodedToken.userId //extrait l'ID utilisateur du token 
        req.auth = { userId } //contient userId extrait du token
        if (req.body.userId && req.body.userId !== userId) { //si la demande contient userID, compare à celui extrait du token. 
            throw 'User id non valable' //S'ils sont différents, génére une erreur ;
        } else { //tout fonctionne, et le user est authentifié
            next() //passe l'exécution 
        }
    } catch (error) {
        res.status(401).json({ error: error | 'requete non authentifiée' })
    }
}