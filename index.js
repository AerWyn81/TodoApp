const app = require('express')()
const path = require('path')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')
var bcrypt = require("bcrypt");
const users = require('./models/users')
const todo = require('./models/todo')
const session = require('express-session');

const PORT = process.env.PORT || 8080

// Moteur pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views/todos'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))

app.use(session({secret: "secretKey"}));

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

// Partie USER login/register
app.get('/register', (req, res, next) => {
  res.render('../users/inscription')
})

app.get('/login', (req, res, next) => {
  res.render('../users/connexion')
})

app.post('/register', (req, res, next) => {
  if(req.body.password && req.body.password2 && req.body.nom && req.body.prenom && req.body.email)
  {
    if (req.body.password.length >= 8)
    {
      if(req.body.password == req.body.password2)
      {
        users.findAll({
          where: {
          email: req.body.email,
          },
          raw: true
        }).then(function(getUser) {
          if (getUser.length == 0){
            var hashPass = bcrypt.hashSync(req.body.password, 10)
            users.build({
              nom: req.body.nom,
              prenom: req.body.prenom,
              password: hashPass,
              email: req.body.email
            }).save().then(() => {
              return res.render('../users/inscription', {success:true, successMsg:"Votre compte vient d'être créer ! Vous pouvez vous connecter !"})
            }).catch((err) => {
              return res.render('../users/inscription', {error:true, errorMsg:"Erreur lors de la création du compte : " + err})
            })
          }
          else
          {
            return res.render('../users/inscription', {error:true, errorMsg:"Un compte avec cette adresse email existe déjà !"})
          }
        }).catch((err) => {
          return res.render('../users/inscription', {error:true, errorMsg:"Erreur lors de la création du compte : " + err})
        })
      }
      else
      {
        return res.render('../users/inscription', {error:true, errorMsg:"Les mots de passe ne correspondent pas !"})
      }
    }
    else
    {
      return res.render('../users/inscription', {error:true, errorMsg:"Votre mot de passe doit avoir 8 caractères minimum !"})
    }
  }
  else
  {
    return res.render('../users/inscription', {error:true, errorMsg:"Veuillez remplir tous les champs !"})
  }
})

app.post('/login', (req, res, next) => {
  if(req.body.password && req.body.email)
    {
      var hashDB = undefined

      users.findAll({
        where: {
          email: req.body.email
        },
        raw: true
      }).then(function(getPass) {
        if (getPass.length == 0){
          return res.render('../users/connexion', {error:true, errorMsg:"Utilisateur inconnu !"})
        }
        else
        {
          hashDB = getPass[0].password

          if (bcrypt.compareSync(req.body.password, hashDB))
          {
            req.session.connected = true;

            todo.findAll().then(function(todos) {
              return res.render('index', {title: "Ma Todolist", todos: todos, moment: require('moment'), connected:true, conn:"Connexion réussie ! Bienvenue :" + req.body.prenom})          }).catch((err) => {
            })
          }
          else
          {
            return res.render('../users/connexion', {error:true, errorMsg:"Erreur dans vos identifiants !"})
          }
        }
      })
    }
    else
    {
       return res.render('../users/connexion', {error:true, errorMsg:"Veuillez remplir tous les champs !"})
    }
})

app.all('*', (req, res, next) => {
  //check session pour voir s'il est déjà connecté
  if (req.session.connected)
  {
    todo.findAll().then(function(todos) {
      return res.render('index', {title: "Ma Todolist", todos: todos, moment: require('moment'), connected:true, conn:"Connexion réussie ! Bienvenue :" + req.body.prenom})          }).catch((err) => {
    })
  }
  else
  {
    res.render('../users/home')
  }
})

// Redirection vers /todos
app.all('/', (req, res) => {
  res.redirect('/todos')
})

app.listen(PORT, () => {
  console.log("Serveur en écoute sur le port : " + PORT)
})