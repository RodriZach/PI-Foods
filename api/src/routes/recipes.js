const { Router } = require('express');
const router = Router();
const { Recipe } = require('../db.js');
require("dotenv").config();
const { API_KEY } = process.env;
const { Sequelize, Op } = require("sequelize");
const axios = require("axios");

router.get('/', async function(req, res){
    const { name } = req.query;
    const apiName = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}?name=${name}`)
    const apiInfo = await apiName.map(a => {
        return {
            name: a.sourceName,
            resumen: a.title,
            healthScore: a.healthScore,
            pasos: a.sourceUrl,
            img: a.image,
            id: a.id,
            diet: a.diets.map(e => e),
            vegetarian: a.vegetarian,
            vegan: a.vegan,
            glutenFree: a.glutenFree
        }
    })
})