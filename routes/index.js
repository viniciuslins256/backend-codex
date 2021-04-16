const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

router.get('/', auth, (req,res) => {
    console.log(res.locals.auth_data);
    return res.send({message: "Essa informação é muito importante!"});
})

router.post('/', (req,res) => {
    return res.send({message: "Tudo ok com o Método POST da raíz!"});
})


module.exports = router;