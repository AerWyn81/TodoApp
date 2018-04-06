const todo = require('../models/todo')
const express = require('express')
const routeur = express.Router()


// Afficher les todos
routeur.get('/', async (req, res, next) =>{
    if (req.query.offset != undefined && !isNaN(req.query.offset) && req.query.limit != undefined && !isNaN(req.query.limit))
    {
        var todoLimit = req.query.limit
        var todoOffset = req.query.offset

        todo.findAll(
        { 
            offset: todoOffset, 
            limit: todoLimit,
            raw: true
        }).then(function(getTodo) {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    todoLimit:req.query.limit,
                    todoOffset:req.query.offset,
                    status:'succes',
                    todos: getTodo
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment')}) 
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    todoLimit:req.query.limit,
                    todoOffset:req.query.offset,
                    status:'error',
                    error: err,
                    todos:"Hors index"
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
    }
    else if (req.query.completion != undefined)
    {
        var todoComplete = req.query.completion
        if (todoComplete == "done") todoComplete = 1
        else todoComplete = 0

        todo.findAll(
        { 
            where: {
                completion: todoComplete,
            },
            raw: true
        }).then(function(getTodo) {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    completion:todoComplete == 0 ? "Non fait (0)" : "Fait (1)",
                    status:'succes',
                    todos: getTodo
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment')}) 
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    completion:todoComplete == 0 ? "Non fait (0)" : "Fait (1)",
                    status:'error',
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
    }
    else
    {
        todo.findAll().then(function(getTodo) {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'succes',
                    todos: getTodo
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment')}) 
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'error',
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
    }
})


routeur.get('/add', async (req, res, next) => {
    res.render('add', {title: "Ajouter une tâche"})
})

// Ajouter une todo
routeur.post('/add', async (req, res, next) => {
    if (req.body.nom != "")
    {
        todo.build(
            {
                nom: req.body.nom,
                description: req.body.description,
            }).save().then(function(getTodo) {
                if(req.accepts("json" , "html") === "json")
                {
                    var json = {
                        status:'succes',
                        ajout: "Tâche ajoutée avec succés !"
                    }
                    res.status(200)
                    return res.send(JSON.stringify(json))
                }
                else 
                {
                    todo.findAll().then(function(getTodo) {
                        if(req.accepts("json" , "html") === "json")
                        {
                            var json = {
                                status:'succes',
                                todos: getTodo
                            }
                            res.status(200)
                            return res.send(JSON.stringify(json))
                        }
                        else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment'), todoSuccess:true, success:"Tâche ajoutée avec succés !"}) 
                    }).catch((err) => {
                        if(req.accepts("json" , "html") === "json")
                        {
                            var json = {
                                status:'error',
                                error: err,
                            }
                            res.status(501)
                            return res.send(JSON.stringify(json))
                        }
                        else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
                    })
                }      
            }).catch((err) => {
                if(req.accepts("json" , "html") === "json")
                {
                    var json = {
                        status:'error',
                        ajout: "Échec de l'ajout de la tâche",
                        error: err,
                    }
                    res.status(501)
                    return res.send(JSON.stringify(json))
                }
                else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
            })
    }
    else
    {
        res.redirect('/');
    }
})

routeur.get('/:todoId/edit', async (req, res, next) => {
    res.render('edit', {title: "Ma Todolist", todoId: req.params.todoId})
})

// Récupérer une todo
routeur.get('/:todoId', async (req, res, next) =>{
    var todoId = req.params.todoId
    
    todo.findAll(
        {
            where: { id:todoId },
            raw: true
        }).then(function(getTodo) {
            if (getTodo.length == 0)
            {
                if(req.accepts("json" , "html") === "json")
                {
                    var json = {
                        status:'succes',
                        id: todoId,
                        todo: "Pas de tâche avec cet ID"
                    }
                    res.status(200)
                    return res.send(JSON.stringify(json))
                }
                else return res.status(200).render('show', {title: "Ma Todolist", todos: getTodo, moment: require('moment'), noTodoFound:true, error: "Pas de tâche trouvée pour cet ID !"}) 
            }

            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'succes',
                    id: todoId,
                    todo: getTodo
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else return res.status(200).render('show', {title: "Ma Todolist", todos: getTodo, moment: require('moment')}) 
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'error',
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('show', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
})

// Lister tous les todos avec Pagination
routeur.get('/:limit/:offset', async (req, res, next) => {
    //Je n'ai pas trouvé le moyen de faire une route avec les arguments, donc je traite la pagination dans la route get('/')...
})

// Supprimer une todo
routeur.delete('/:todoId', async (req, res) => {
    var todoId = req.params.todoId
    todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowDeleted){
        if(rowDeleted === 1){
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'succes',
                    id: todoId,
                    Suppression: "OK"
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else
            {
                todo.findAll().then(function(getTodo) {
                    if(req.accepts("json" , "html") === "json")
                    {
                        var json = {
                            status:'succes',
                            todos: getTodo
                        }
                        res.status(200)
                        return res.send(JSON.stringify(json))
                    }
                    else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment'), todoSuccess:true, success:"Tâche supprimée avec succés !"}) 
                }).catch((err) => {
                    if(req.accepts("json" , "html") === "json")
                    {
                        var json = {
                            status:'error',
                            error: err,
                        }
                        res.status(501)
                        return res.send(JSON.stringify(json))
                    }
                    else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
                })
            }
         }
      }).catch((err) => {
        if(req.accepts("json" , "html") === "json")
        {
            var json = {
                status:'error',
                error: err,
            }
            res.status(501) 
            return res.send(JSON.stringify(json))
        }
        else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
    })
})

// Éditer une todo (la passer en done par exemple)
routeur.patch('/:todoId', async (req, res, next) => {
    var todoId = req.params.todoId
    var newNom = req.body.nom
    var newDesc = req.body.description
    var newComplet = req.body.checkbox ? true : false
    var isComplete

    todo.find({
        where: {
            id: todoId
        }
    }).then(function(getTodo) {
        if (getTodo == null)
        {
            res.redirect('/')
            return
        }

        isComplete = getTodo.completion
        if (newNom == undefined) newNom = getTodo.nom
        if (newDesc == undefined) newDesc = getTodo.description
        if (!newComplet && isComplete) isComplete = false
        else if (!newComplet && !isComplete) isComplete = true
        else if (newComplet && !isComplete) isComplete = true
    
        todo.update({
            completion: isComplete,
            nom: newNom,
            description: newDesc,
            updatedAt: Date.now()
        },
        {   where: {
                id: todoId
            }
        }
        ).then(() => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'succes',
                    ajout: "Modification effectuée avec succés !",
                    completion: isComplete
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else 
            {
                todo.findAll().then(function(getTodo) {
                    if(req.accepts("json" , "html") === "json")
                    {
                        var json = {
                            status:'succes',
                            todos: getTodo
                        }
                        res.status(200)
                        return res.send(JSON.stringify(json))
                    }
                    else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment'), todoSuccess:true, success:"Tâche modifiée avec succés !"}) 
                }).catch((err) => {
                    if(req.accepts("json" , "html") === "json")
                    {
                        var json = {
                            status:'error',
                            error: err,
                        }
                        res.status(501)
                        return res.send(JSON.stringify(json))
                    }
                    else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
                })
            }      
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'error',
                    ajout: "Échec de la modification de la tâche",
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
    })
})

module.exports = routeur