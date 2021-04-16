const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
//Funções auxiliares

const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in});
}


router.post('/create', async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({ 'error': 'Dados insuficientes!' });

    try{
        if (await Users.findOne({email})) return res.status(400).json({ 'error': 'Usuário já registrado!' });

        const user = await Users.create(req.body);
        user.password = undefined;

        return res.send({user, token: createUserToken(user.id)});
        
    }
    catch (err) {
       return res.status(500).json({ 'error': 'Erro ao buscar usuário!' });
    }
})


router.post('/auth', async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ 'error': 'Dados insuficientes!' });

    try{
        const user = await Users.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ 'error': 'Usuário não registrado!' });

        const pass_ok = await bcrypt.compare(password, user.password);
        if(!pass_ok) return res.status(401).json({ 'error': 'Senha inválida!' });

        user.password = undefined;
        return res.send({user, token: createUserToken(user.id)});
    }
    catch (err) {
        return res.status(500).json({ 'error': 'Erro ao buscar usuário!' });
    }
    
});


module.exports = router;