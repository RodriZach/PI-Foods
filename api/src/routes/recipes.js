const { Router } = require('express');
const router = Router();
const apiTrucha = require('../falseApi.json');
const { Recipe, Diet } = require('../db.js');
require("dotenv").config();
const { API_KEY } = process.env;
const { Sequelize, Op } = require("sequelize");
const axios = require("axios");



const getApiAllRecipes = async function () {
    let apiInfo = apiTrucha;
    let apiRecipes = await apiInfo.map(a => {
    //let apiInfo = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
    //let apiRecipes = await apiInfo.data.results.map(a => {
        return {
            id: a.id,
            title: a.title,
            healthScore: a.healthScore,
            summary: a.summary,
            analyzedInstructions: a.analyzedInstructions,
            img: a.image,
            diet: a.diets.map(e => e),
            vegetarian: a.vegetarian,
            vegan: a.vegan,
            glutenFree: a.glutenFree
        }

    });
    return apiRecipes;
};

const getApiNameRecipes = async function (name) {
    try {
        //let apiInfo = apiTrucha;
        let apiInfo = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&title=${name}&number=100`);
        let apiRecipes = await apiInfo.data.results.map(a => {
            return {
                id: a.id,
                title: a.title,
                healthScore: a.healthScore,
                summary: a.summary,
                analyzedInstructions: a.analyzedInstructions,
                img: a.image,
                diet: a.diets.map(e => e),
                vegetarian: a.vegetarian,
                vegan: a.vegan,
                glutenFree: a.glutenFree
            }
        });
        return apiRecipes;
    } catch (error) {
        console.log(error)
    };
};

const getDbAllRecipes = async function () {
    return await Recipe.findAll({
        include: {
            model: Diet,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    })
};

const getApiIdRecipes = async function (id) {
    // let idApiInfo = fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    //     .then(res => res.json())
    //     .then(json => {
    //         return {
    //             id: json.id,
    //             title: json.title,
    //             healthScore: json.healthScore,
    //             summary: json.summary,
    //             analyzedInstructions: json.analyzedInstructions,
    //             img: json.image,
    //             diet: json.diets.map(e => e),
    //             vegetarian: json.vegetarian,
    //             vegan: json.vegan,
    //             glutenFree: json.glutenFree
    //         }
    //     })
    // return idApiInfo;
    const { data } = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
    return {
        id: data.id,
        title: data.title,
        healthScore: data.healthScore,
        summary: data.summary,
        analyzedInstructions: data.analyzedInstructions,
        img: data.image,
        diet: data.diets.map(e => e),
        vegetarian: data.vegetarian,
        vegan: data.vegan,
        glutenFree: data.glutenFree
    }
};

const getAllRecipes = async function () {
    const apiRecipes = await getApiAllRecipes();
    const DbRecipes = await getDbAllRecipes();
    const totalRecipes = apiRecipes.concat(DbRecipes);
    return totalRecipes;
};

router.get('/', async function (req, res) {
    const { name } = req.query;
    let allRecipes = await getAllRecipes();
    try {

        if (name) {
            const nameRecipe = allRecipes.filter(a => a.title.toLowerCase().includes(name.toLocaleLowerCase()));
            if (nameRecipe.length) {
                res.status(200).send(nameRecipe);
            } else {
                res.status(404).send('No se encontro ninguna receta con ese nombre');
            }

        } else {
            res.status(200).send(allRecipes);
        }

    } catch (error) {
        res.status(404).json({ msg: 'error de name' })
    }
}
);

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    try {
        let idDb = await Recipe.findByPk(id, {
            include: {
                model: Diet,
                attributes: ['name'],
                through: {
                    attributes: [],
                }
            }
        })
        if (idDb) return res.json(idDb);
    } catch {
        try {
            let idApi = await getApiIdRecipes(id);
            if (idApi) return res.json(idApi);
            res.status(404).json('No se encontro la receta')
        } catch (error) {
            res.status(404).json({ msg: 'error' })
        }

    }

 });

 router.post('/', async function(req, res) {
    const { title, healthScore, summary, analyzedInstructions, img, diets } = req.body;
    if(!title || !summary) res.status(404).json({ msg: 'Datos incompletos'})
    const newRecipe = await Recipe.create({
        title,
        healthScore,
        summary,
        analyzedInstructions,
        img
    });
    await newRecipe.addDiets(diets);
    res.send('Receta creada');
 })




module.exports = router;