const express = require("express");
const router = express.Router();

const {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  getOneInvoice,
  getLastInvoice,
  cancelInvoice,
  deleteInvoice,
  test
} = require("../controllers/invoiceController");

router.get("/get-all-invoices/:type", getAllInvoices);
router.get("/get-invoice/:invoice_id", getOneInvoice);
router.get("/get-last-invoice/:invoice_type", getLastInvoice);
router.post("/:user_id", createInvoice);
router.put("/", updateInvoice);
router.post("/cancel-invoice/:invoice_id/:cancel_type", cancelInvoice)
router.delete("/delete-invoice/:invoice_id", deleteInvoice)
router.get("/test", test);

module.exports = router;
