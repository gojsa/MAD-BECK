const express = require("express");
const router = express.Router();

const {
  getAllConfigurator,
  createConfigurator,
  updateConfigurator,
  getOneConfigurator
} = require("../controllers/articleConfiguratorController");

router.get("/", getAllConfigurator);
router.get("/:column", getOneConfigurator);
router.post("/", createConfigurator);
router.put("/", updateConfigurator);

module.exports = router;
