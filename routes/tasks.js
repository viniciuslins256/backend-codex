const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const Users = require('../model/user');
router.use(express.json())

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

//Lista todas as tarefas de um determinado usuário autenticado com token;
router.get('/', auth, async (req,res) => {
    try{
        const id = res.locals.auth_data.id;
        const string_id = `${id}`;
        const user = await Users.findOne({"_id" : string_id});
        const tasks = user.tasks;
        return res.json(tasks);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ 'error': 'Erro na consulta de Tarefas!'});
    }
});


router.get('/:ordered', auth, async (req,res) => {
    var ordered = req.params.ordered;
    ordered = `${ordered}`;
    if(!ordered || ordered !== 'priority' && ordered !== 'title') return res.status(400).json({ 'error': 'Parâmetro de ordenação inválido!' });
    try{
        const id = res.locals.auth_data.id;
        const string_id = `${id}`;
        const user = await Users.findOne({"_id" : string_id});
        const tasks = user.tasks.sort(dynamicSort(ordered));

        return res.json(tasks);
    }
    catch (err) {
        return res.status(500).json({ 'error': 'Erro na busca ordenada de Tarefas!'});
    }
});


router.post("/create", auth, async (req, res) => {
    var { title, priority } = req.body;

    if(!priority){ priority = 'low';}

    if(!title) return res.status(400).json({ 'error': 'Está faltando o título da sua tarefa!' });

    try{
        const id = res.locals.auth_data.id;
        const string_id = `${id}`;
        const string_title = `${title}`;
        const user = await Users.findOne({"_id" : string_id});
        if (await user.tasks.find(task => task.title.toLowerCase() === string_title.toLowerCase())) return res.status(400).json({ 'error': 'Tarefa já existente!' })
        const task = {
            title :  title,
            priority : priority
        };
        
        user.tasks.push(task);

        Users.updateOne({"_id" : string_id}, user, function(err, res) {
            if (err) return res.status(400).json({ 'error': 'Erro ao cadastrar tarefa no usuário!' });
        });

        return res.json(task);
        
    }
    catch (err) {
       return res.status(500).json({ 'error': 'Erro ao criar tarefa!' });
    }
})


router.delete('/delete/:title', auth, async (req, res) => {
    const title = req.params.title;
    const id = res.locals.auth_data.id;
    const string_id = `${id}`;
    const string_title = `${title}`;
    const user = await Users.findOne({"_id" : string_id});
    try{
        const task = user.tasks.find(task => task.title.toLowerCase() === string_title.toLowerCase());
        if (await !task) return res.status(400).json({ 'error': 'Tarefa não encontrada!' })
        user.tasks = user.tasks.filter(function(value){ 
            return value.title.toLowerCase() != string_title.toLowerCase();
        });
        
        Users.updateOne({"_id" : string_id}, user, function(err, res) {
            if (err) return res.status(400).json({ 'error': 'Erro ao apagar tarefa do usuário!' });
        });
        
        return res.json(task);
        
    }
    catch(err){
        return res.status(500).json({ 'error': 'Erro ao apagar tarefa!' });
    }
})

router.put("/edit/:title", auth, async (req, res) => {
    const title = req.params.title;
    const id = res.locals.auth_data.id;
    const string_id = `${id}`;
    const string_title = `${title}`;
    const user = await Users.findOne({"_id" : string_id});
    try{
        const task = user.tasks.find(task => task.title.toLowerCase() === string_title.toLowerCase());
        if (await !task) return res.status(400).json({ 'error': 'Tarefa não encontrada!' })
        
        var newTitle = req.body.new_title;        
        console.log(newTitle);

        if(!newTitle) return res.status(400).json({ 'error': 'Não foi passado um novo título da tarefa!' });
        newTitle = `${newTitle}`;
        user.tasks.find(task => task.title.toLowerCase() === string_title.toLowerCase()).title = newTitle;

        Users.updateOne({"_id" : string_id}, user, function(err, res) {
            if (err) return res.status(400).json({ 'error': 'Erro ao renomear tarefa do usuário!' });
        });
        
        return res.json(task);
        
    }
    catch(err){
        return res.status(500).json({ 'error': 'Erro ao renomear tarefa!' });
    }
})

module.exports = router;