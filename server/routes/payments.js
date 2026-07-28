const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentsController");

router.get("/", authenticateToken, getPayments);

router.get("/:id", authenticateToken, getPaymentById);

router.post("/", authenticateToken, createPayment);

router.put("/:id", authenticateToken, updatePayment);

router.delete("/:id", authenticateToken, deletePayment);

module.exports = router;