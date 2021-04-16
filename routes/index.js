const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

router.get('/', auth, (req,res) => {
    return res.json({message: "Método GET da raíz!"});
})

router.post('/', (req,res) => {
    return res.json({message: "Tudo ok com o Método POST da raíz!"});
})


module.exports = router;