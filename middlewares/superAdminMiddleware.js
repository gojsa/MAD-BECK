const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = db.users;
const Functions = db.functions;
const Groups = db.groups;


const superAdmin = asyncHandler(async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            //Get token from headers
            token = req.headers.authorization.split(" ")[1];

            //Verify token
            const decode = jwt.decode(token, process.env.JWT_SECRET);


            //Get user from token
            let attributes = ['users_id', 'user_name', 'email']
            User.findByPk(decode.id, {
                attributes,
                include: [
                    {
                        model: Groups,
                        attributes: ['name'],
                        include: [
                            {
                                model: Functions,
                                attributes: ['name'],
                                through: { attributes: [] }
                            }
                        ]
                    }
                ]
            }
            )
                .then(user => {
                    let obj = user.group.functions.find(o => o.name === 'SUPERADMIN');

                    if (obj) {
                        req.user = user;
                        next();
                        return;
                    } else {
                        return res.status(401).send({
                            message: "Unauthorized"
                        });
                    }

                });

        } catch (error) {
            return res.status(401).send({
                message: "Unauthorized"
            });
        }
    }

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

});

module.exports = { superAdmin };