const express = require('express');
const router = express.Router();
const { getFunctions, createFunction, getFunctionByName, removeFunctions } = require('../controllers/functionController');
const { admin } = require('../middlewares/adminMiddleware');
const { superAdmin } = require('../middlewares/superAdminMiddleware');


router.get('/', getFunctions);
router.get('/getfunction/:name', admin, getFunctionByName);
router.post('/', superAdmin, createFunction);
router.delete('/:functions_id', admin, getFunctionByName);

module.exports = router;
