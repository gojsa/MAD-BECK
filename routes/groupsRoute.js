const exoress = require('express');
const router = exoress.Router();
const { createGroup, updateGroup, getGroups, getGroupByName, getGroupByMe, removeGroup } = require('../controllers/groupsControler');
const { admin } = require('../middlewares/adminMiddleware');
const { protect } = require('../middlewares/authMiddleware');



router.get('/', protect, getGroups);
router.get('/getgroup/:name', protect, getGroupByName);
router.post('/', protect, createGroup);
router.put('/', protect, updateGroup);
router.get('/mygroup/:company_name', protect,  getGroupByMe);
router.delete('/:groups_id', protect, removeGroup);




module.exports = router;