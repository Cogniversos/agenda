const express = require("express");

const router = express.Router();

const profesionales = require("../data/profesionales");

router.get("/",(req,res)=>{

    res.json(profesionales);

});

module.exports = router;