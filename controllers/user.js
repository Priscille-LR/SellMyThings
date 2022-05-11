const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')


//CRÉER UN USER 

//La méthode  hash()  de bcrypt crée un hash crypté des mots de passe 
//des utilisateurs pour les enregistrer de manière sécurisée dans la base de données.


//call fonction de hachage de bcrypt dans le mot de passe 
// « saler » le mot de passe 10 fois
//Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé
//renvoie une Promise dans laquelle on reçoit le hash généré
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            //créer user et enregistre dans la DB
            user.save()
                .then(() => res.status(201).json({ message: 'user créé!' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}


//PERMET AU USER EXISTANT DE SE CONNECTER

//récup l'user dans la DB correspondant a l'adresse mail entrée 
// renvoie une erreur si on le trouve pas dans la DB 
// compare le mdp entré avec le hash dans la DB
// si comparaison pas bonne => erreur 401 Unauthorized
// sinon on renvoie un user id et un token d'authentification (chaine générique for now)

//La méthode compare de bcrypt compare un string avec un hash pour, 
//par ex, vérifier si un mdp entré par le user correspond à un hash sécurisé enregistré en DB – 
//cela montre que même bcrypt ne peut pas décrypter ses propres hashs.

//jwt = tokens encodés qui peuvent être utilisés pour l'autorisation.
//méthode sign() utilise une clé secrète pour encoder un token qui peut contenir un payload personnalisé et avoir une validité limitée.

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'user non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //encoder un nouveau token 
                            //ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;
                            { userId: user._id }, //appliquer le bon user a chaque objet et ne pas pouvoir modifier les objets des autres users
                            'RANDOM_TOKEN_SECRET', //chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder le token
                            { expiresIn: '24h' } //durée de validité => le user devra se reconnecter au bout de 24h
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}