const asyncHandler = require('express-async-handler');
const db = require('../config/db');
const Function = db.functions;
const Op = db.Op;



// GET ALL FUNCTIONS
const getFunctions = (req, res) => {

    Function.findAll()
        .then(functions => {
            res.status(200).json({
                functions
            })
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get all functions");
        })
}



// GET FUNCTION BY NAME
const getFunctionByName = (req, res) => {

    const name = req.params.name;

    if (!name) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    Function.findAll({
        where: {
            name
        }
    })
        .then(func => {
            res.status(200).json({
                functions: func
            }
            )
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get function please try latter");
        });
}



// CREATE FUNCTION 
const createFunction = asyncHandler(async (req, res) => {
    let { name, created_by, updated_by } = req.body;

    if (!name || !created_by || !updated_by) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    name = name.toUpperCase();

    const functionExist = await Function.findAll({
        where: {
            name
        }
    });

    if (functionExist && functionExist.length) {
        res.status(500);
        throw new Error("Function already exist");
    }

    const newFunction = await Function.create({
        name,
        created_by,
        updated_by
    });

    if (!newFunction) {
        res.status(500);
        throw new Error("Cant`t create function please try latter.");
    }

    res.status(201).json({
        name: newFunction.name,
        created_by: newFunction.created_by,
        updated_by: newFunction.updated_by
    });
});

// DELETE function
const removeFunctions = asyncHandler(async (req, res) => {
    const functions_id = req.params.functions_id;


    if (!functions_id) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const functions = await Function.destroy({
        where: {
            functions_id
        }
    });

    if (!functions) {
        res.status(400);
        throw new Error("Function does not exist");
    }

    res.status(200).json({ message: 'Function removed' });

});


module.exports = { createFunction, getFunctions, getFunctionByName, removeFunctions };
