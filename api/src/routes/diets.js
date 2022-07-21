const { Router } = require('express');
const router = Router();
const apiTrucha = require('../falseApi.json');
const { Recipe, Diet } = require('../db.js');
require("dotenv").config();
const { API_KEY } = process.env;
const { Sequelize, Op } = require("sequelize");
const axios = require("axios");


router.get('/', async function(req, res){
    try {
        const list = await Diet.findAll();
        res.json(list)
    } catch (error) {
        res.status(404).json({msg: error})
    }

})




module.exports = router;