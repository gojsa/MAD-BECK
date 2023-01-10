const express = require("express");
const router = express.Router();

const {
  getAllStorage,
  createStorage,
  updateStorage,
  getOneStorage,
  createStorageStatus,
  getStorageArticleInfo,
  getOneStorageArticleInfo,
  getStorageArticles,
  getMovementArticle,
  getAllStorageWithType,
  getByOrg
} = require("../controllers/storageController");

// router.get("/getstoragearticleinfo", getStorageArticleInfo);
// router.get("/getallstoragearticle/:storage_id", getStorageArticles);
// router.get("/getmovementarticle/:storage_id/:article_id", getMovementArticle);
// router.get("/getstoragewithtype/:type_of_storage/:org_unit", getAllStorageWithType);
// router.get("/:org_unit", getAllStorage);
// router.get("/:storage_id", getOneStorage);
// router.get("/:storage_id/:article_id", getOneStorageArticleInfo);
router.get("/getbyorg/:org_id",getByOrg)
// router.post("/", createStorage);
// router.put("/", updateStorage);
// router.post("/storagestatus", createStorageStatus);

module.exports = router;
