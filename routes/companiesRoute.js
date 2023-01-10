const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();

const { getCompanies, getCompanyByName, createCompany, updateCompany, removeCompany, getCompaniesWorkingHours } = require('../controllers/companyController');
const { superAdmin } = require('../middlewares/superAdminMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const { protect } = require('../middlewares/authMiddleware');




router.get('/', protect, getCompanies);
router.get('/getcompany/:name', protect, getCompanyByName);
router.get('/:companies_id', protect,  getCompaniesWorkingHours);
router.post('/', [protect, upload.single('image')], createCompany);
router.put('/', protect, updateCompany);
router.delete('/:companies_id', protect,  removeCompany);


module.exports = router;