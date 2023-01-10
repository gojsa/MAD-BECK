const express = require("express");
const router = express.Router();

const {
  getAllArticles,
  createArtical,
  updateArticle,
  getOneArticle,
  getAllArticlesWIthType
} = require("../controllers/articlesController");

router.get("/", getAllArticles);
router.get("/:article_id", getOneArticle);
router.get("/getarticlewithtype/:type_of_article", getOneArticle);
router.post("/", createArtical);
router.put("/", updateArticle);

module.exports = router;
