# TodoApp (Node JS, Express, Sequelize, Pug)

Petit projet de réalisation d'une todolist en node JS pour le cours de NodeJS. 
Beaucoup de diffculté n'ayant aucune connaissance en NodeJS au départ, ce projet n'est pas optimisé ou développé par un grand expert en NodeJS... 

## Installation

1. Clone ce dépôt
2. `npm install`
3. Utiliser la commande `node index.js`

Rendez-vous sur *localhost:8080*.

## Fonctionnalités

-  Système d'authentification
-  Hashage de mot de passe
-  Création, modification, suppression de tâche
-  Attaquable côté web ou en json

## Utilisation

| Lien                    | Fonctionnalité            |
| ------------------------|:-------------------------:|
| /todos                  | Affiche les tâches        |
| /todos/:id              | Affiche la tâche par id   |
| /todos/:id/edit         | Permet d'éditer une tâche |
| /todos/add              | Permet d'ajouter une tâche|
| /login                  | Connexion                 |
| /register               | Inscription               |
| /todos?limit=?&offset=? | Pagination                |

## Finalisation

Le TP n'est malheureusement pas fini, la suite ne m'a pas l'air réalisable dans le temps imparti... et avec les quelques connaissances que j'ai grâce au cours et à Internet. Il manque la gestion des teams et la récupération des todos en fonction de l'utilisateur. Le reste est normalement OK.