const paymentsService = require("../services/paymentsService");

const getPayments = async (req, res) => {
  try {
    const payments = await paymentsService.getAllPayments();

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await paymentsService.getPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const {
      registration_id,
      festival_id,
      position,
      meters,
      amount,
    } = req.body;

    if (
      !registration_id ||
      !festival_id ||
      !position ||
      meters === undefined ||
      amount === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (Number(meters) <= 0) {
      return res.status(400).json({
        message: "Meters must be greater than zero.",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        message: "Amount cannot be negative.",
      });
    }

    const registration =
      await paymentsService.registrationExists(registration_id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    const festival =
      await paymentsService.festivalExists(festival_id);

    if (!festival) {
      return res.status(404).json({
        message: "Festival not found.",
      });
    }

    const payment = await paymentsService.createPayment(req.body);

    res.status(201).json(payment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      registration_id,
      festival_id,
      position,
      meters,
      amount,
    } = req.body;

    if (
      !registration_id ||
      !festival_id ||
      !position ||
      meters === undefined ||
      amount === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingPayment =
      await paymentsService.getPaymentById(id);

    if (!existingPayment) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    const registration =
      await paymentsService.registrationExists(registration_id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    const festival =
      await paymentsService.festivalExists(festival_id);

    if (!festival) {
      return res.status(404).json({
        message: "Festival not found.",
      });
    }

    if (Number(meters) <= 0) {
      return res.status(400).json({
        message: "Meters must be greater than zero.",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        message: "Amount cannot be negative.",
      });
    }

    const updatedPayment =
      await paymentsService.updatePayment(id, req.body);

    res.json(updatedPayment);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await paymentsService.getPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    await paymentsService.deletePayment(id);

    res.json({
      message: "Payment deleted successfully.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};