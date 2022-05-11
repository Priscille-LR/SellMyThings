// const http = require('http')
// //Ici, vous importez le package HTTP natif de Node et l'utilisez pour créer un serveur, 
// //en passant une fonction qui sera exécutée à chaque appel effectué vers ce serveur. 
// //Cette fonction reçoit les objets request et response en tant qu'arguments. 
// //Dans cet exemple, vous utilisez la méthode end de la réponse pour renvoyer une réponse de type string à l'appelant.
// //prend comme arg la f° qui est appelé a chaque req vers le serveur 

// const app = require('./app')
// app.set('port', process.env.PORT || 3000)

// //Node utilise le système de module CommonJS, donc pour importer le contenu d'un module JavaScript, 
// //on utilise le mot-clé require plutôt que le mot-clé import .
// const server = http.createServer(app)

// //configurer le serveur pour qu'il écoute soit variable d'env du port soit le port 3000
// //si l'env où tourne le serveur envoie un port à utiliser. sinon par def, port 3000 
// server.listen(process.env.PORT || 3000) 

const http = require('http');
const app = require('./app');

// renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. 
//Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//un écouteur d'évènements est également enregistré, 
//consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.listen(port);
