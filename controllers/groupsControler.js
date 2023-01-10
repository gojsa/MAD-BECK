const asyncHandler = require("express-async-handler");
const db = require('../config/db');
const Group = db.groups;
const Function = db.functions;
const Op = db.Op;
const sequelize = db.sequelize;
// GET ALL Groups
const getGroups = (req, res) => {

    Group.findAll()
        .then(groups => {
            res.status(200).json({
                groups
            })
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get all groups please try latter");
        })
}


// GET Group BY NAME
const getGroupByName = (req, res) => {

    const name = req.params.name;

    if (!name) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    Group.findOne({
        where: {
            name
        },
        include: [{
            model: Function,
            through: { attributes: [] }
        }
        ]
    })
        .then(groups => {
            res.status(200).json({
                groups
            });
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get  group please try latter");
        });
}



// GET Group BY ME
const getGroupByMe =  asyncHandler(async(req, res) => {

    const company_name = req.params.company_name;

    if (!company_name) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    await Group.findAll({
        where: {
            created_by: company_name
        }
    })
        .then(groups => {
            res.status(200).json({
                groups,
                user: req.user
            });
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get  group please try latter");
        });
})



// CREATE Group 
const createGroup = asyncHandler(async (req, res) => {
    let { name, created_by, updated_by, functions } = req.body;

    if (!name || !created_by) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    name = name.toUpperCase();

    const groupExist = await Group.findAll({
        where: {
            name
        }
    });

    if (groupExist && groupExist.length) {
        res.status(500);
        throw new Error("Group already exist");
    }


    const arrFunc = functions.split(',');

    const group = await Group.create({
        name,
        created_by,
        updated_by
    });

    if (!group) {
        res.status(500);
        throw new Error("Can`t add group please try latter");
    }

    const functionsAll = await Function.findAll({
        where: {
            name: {
                [Op.in]: arrFunc
            }
        }
    });

    if (!functionsAll) {
        res.status(500);
        throw new Error("Can`t find functions please try latter");
    }

    group.addFunctions(functionsAll);

    res.status(201).json({
        name: group.name,
        created_by: group.created_by,
        updated_by: group.updated_by
    });
});



// UPDATE Group 
const updateGroup = asyncHandler(async (req, res) => {
    let { functions, name } = req.body;

    if (!functions) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const groupExist = await Group.findOne({
        where: {
            name
        }
    });

    if (!groupExist) {
        res.status(500);
        throw new Error("Group does not exist");
    }

    const arrFunc = functions.split(',');


    const functionsAll = await Function.findAll({
        where: {
            name: {
                [Op.in]: arrFunc
            }
        }
    });


    if (!functionsAll) {
        res.status(500);
        throw new Error("Can`t find functions please try latter");
    }


    try {

        const result = await sequelize.transaction(async (t) => {

            await sequelize.query(`DELETE FROM groups_functions WHERE groups_id = ${groupExist.groups_id}`, { transaction: t });

            await groupExist.addFunctions(functionsAll, { transaction: t });


        });

    } catch (err) {
        res.status(500);
        throw new Error("Can`t find functions please try latter");
    }


    res.status(201).json({
        message: 'Group functions updated'
    });
});



// DELETE grups
const removeGroup = asyncHandler(async (req, res) => {
    const groups_id = req.params.groups_id;


    if (!groups_id) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const group = await Group.destroy({
        where: {
            groups_id
        }
    });

    if (!group) {
        res.status(400);
        throw new Error("Group does not exist");
    }

    res.status(200).json({ message: 'Group removed' });

});

module.exports = { createGroup, updateGroup, getGroups, getGroupByName, getGroupByMe, removeGroup };
