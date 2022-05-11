const express = require('express')

const app = express() //créer app express

const mongoose = require('mongoose')

const stuffRoutes = require('./routes/stuff')

mongoose.connect('mongodb+srv://priscille-lr:censure@cluster0.5tzsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  
//et met à disposition leur  body  directement sur l'objet req, 
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/stuff', stuffRoutes)

module.exports = app;

