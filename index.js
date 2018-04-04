const app = require('express')()
const path = require('path')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')
const PORT = process.env.PORT || 8080

// Moteur pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views/todos'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))

// Override pour les méthodes PATCH et DELETE
app.use(methodOverride('_method', { methods: [ 'POST', 'GET' ] }))
// Routes
app.use('/todos', require("./controllers/todo"))

// Gestion des erreurs
// Notez les 4 arguments !!
app.use(function(err, req, res, next) {
  // Les données de l'erreur
  let data = {
    message: err.message,
    status: err.status || 500
  }

  // En mode développement, on peut afficher les détails de l'erreur
  if (app.get('env') === 'development') {
    data.error = err.stack
  }

  // On set le status de la réponse
  res.status(data.status)

  // Réponse multi-format
  res.format({
    html: () => { res.render('error', data) },
    json: () => { res.send(data) }
  })
})

// Redirection vers /todos
app.all('/', (req, res) => {
  res.redirect('/todos')
})

app.listen(PORT, () => {
  console.log("Serveur en écoute sur le port : " + PORT)
})