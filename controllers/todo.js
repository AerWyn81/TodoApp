const todo = require('../models/todo')
const express = require('express')
const routeur = express.Router()


// Afficher les todos
routeur.get('/', (req, res, next) =>{
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
                    status:'get',
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
                    status:'get',
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
                    status:'get',
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
                    status:'get',
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
                    status:'get',
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
                    status:'get',
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
    }
})

// Ajouter une todo
routeur.post('/', (req, res, next) =>{
    if (req.params.nom != "")
    {
        console.log(Date.now())
        todo.build(
            {
                nom: req.body.nom,
                description: req.body.description,
            }).save().then(function(getTodo) {
                if(req.accepts("json" , "html") === "json")
                {
                    var json = {
                        status:'post',
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
                                status:'post',
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
                                status:'get',
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
                        status:'get',
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
        return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Le champs \"Nom de la tâche\" doit être rempli !"}) 
    }
})

// Récupérer une todo
routeur.get('/:todoId', (req, res, next) =>{
    var todoId = req.params.todoId
    
    todo.findAll(
        {
            where: { id:todoId },
            raw: true
        }).then(function(getTodo) {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'get',
                    id: todoId,
                    todo: getTodo
                }
                res.status(200)
                return res.send(JSON.stringify(json))
            }
            else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment')}) 
        }).catch((err) => {
            if(req.accepts("json" , "html") === "json")
            {
                var json = {
                    status:'get',
                    error: err,
                }
                res.status(501)
                return res.send(JSON.stringify(json))
            }
            else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
        })
})

// Lister tous les todos avec Pagination
routeur.get('/:limit/:offset', (req, res, next) => {
    //Je n'ai pas trouvé le moyen de faire une route avec les arguments, donc je traite la pagination dans la route get('/')...
})

// Supprimer une todo
routeur.delete('/:todoId', (req, res) => {
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
                    status:'delete',
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
                            status:'post',
                            todos: getTodo
                        }
                        res.status(200)
                        return res.send(JSON.stringify(json))
                    }
                    else return res.status(200).render('index', {title: "Ma Todolist", todos: getTodo, moment: require('moment'), todoSuccess:true, success:"Tâche suppérimée avec succés !"}) 
                }).catch((err) => {
                    if(req.accepts("json" , "html") === "json")
                    {
                        var json = {
                            status:'get',
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
                status:'delete',
                error: err,
            }
            res.status(501) 
            return res.send(JSON.stringify(json))
        }
        else return res.status(501).render('index', {title: "Ma Todolist", todos: [], moment: require('moment'), noTodoFound:true, error: "Erreur serveur : \n" + err}) 
    })
})

// Éditer une todo (la passer en done par exemple)
routeur.patch('/:todoId', (req, res, next) => {
    var todoId = req.params.todoId
    var isComplete

    todo.find({
        where: {
            id: todoId
        }
    }).then(function(getTodo) {
        isComplete = getTodo.completion

        if (isComplete == 1) isComplete = 0
        else isComplete = 1
    
        todo.update({
            completion: isComplete,
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
                    status:'patch',
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
                            status:'patch',
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
                            status:'patch',
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
                    status:'patch',
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