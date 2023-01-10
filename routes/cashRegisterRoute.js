const express = require('express');
const router = express.Router();

const { generateInvoice, getCommands, period, periodReport, end, duplicate, checkStorageStatus } = require("../controllers/cashRegisterController");
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.post('/generate/:invoice_id', /*protect,*/ generateInvoice);
router.get('/get-commands/:companyId', /*protect,*/ getCommands);
router.post('/duplicate', /*protect,*/ duplicate);
router.post('/period', period)
router.post('/period-report', periodReport)
router.post('/end', /*protect,*/ end);
router.get('/check-storage-status/:invoice_id', checkStorageStatus)

module.exports = router;