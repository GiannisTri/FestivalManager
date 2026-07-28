const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} = require("../controllers/registrationsController");

router.get("/", authenticateToken, getRegistrations);

router.get("/:id", authenticateToken, getRegistrationById);

router.post("/", authenticateToken, createRegistration);

router.put("/:id", authenticateToken, updateRegistration);

router.delete("/:id", authenticateToken, deleteRegistration);

module.exports = router;