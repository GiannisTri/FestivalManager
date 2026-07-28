const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getFestivals,
} = require("../controllers/festivalsController");

router.get("/", authenticateToken, getFestivals);

module.exports = router;