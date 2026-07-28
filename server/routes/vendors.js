const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorsController");

router.get("/", authenticateToken, getVendors);

router.get("/:id", authenticateToken, getVendorById);

router.post("/", authenticateToken, createVendor);

router.put("/:id", authenticateToken, updateVendor);

router.delete("/:id", authenticateToken, deleteVendor);

module.exports = router;