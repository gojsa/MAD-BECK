const express = require("express");
const router = express.Router();

const {
    getAllStorageConfigurator,
    createStorageConfigurator,
    updateStorageConfigurator,
    getOneStorageConfigurator
} = require("../controllers/storageConfiguratorController");

router.get("/", getAllStorageConfigurator);
router.get("/:column", getOneStorageConfigurator);
router.post("/", createStorageConfigurator);
router.put("/", updateStorageConfigurator);

module.exports = router;
