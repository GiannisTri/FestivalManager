const registrationsService = require("../services/registrationsService");

const getRegistrations = async (req, res) => {
  try {
    const registrations = await registrationsService.getAllRegistrations();

    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await registrationsService.getRegistrationById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const createRegistration = async (req, res) => {
  try {
    const { vendor_id, year } = req.body;

    if (!vendor_id || !year) {
      return res.status(400).json({
        message: "Vendor and year are required.",
      });
    }

    const vendor = await registrationsService.vendorExists(vendor_id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    const existingRegistration =
      await registrationsService.registrationExists(vendor_id, year);

    if (existingRegistration) {
      return res.status(409).json({
        message: "Registration already exists for this vendor and year.",
      });
    }

    const registration =
      await registrationsService.createRegistration(vendor_id, year);

    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_id, year } = req.body;

    if (!vendor_id || !year) {
      return res.status(400).json({
        message: "Vendor and year are required.",
      });
    }

    const registration =
      await registrationsService.getRegistrationById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    const vendor = await registrationsService.vendorExists(vendor_id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    const duplicate =
      await registrationsService.registrationExists(vendor_id, year);

    if (duplicate && duplicate.id !== Number(id)) {
      return res.status(409).json({
        message: "Registration already exists for this vendor and year.",
      });
    }

    const updatedRegistration =
      await registrationsService.updateRegistration(
        id,
        vendor_id,
        year
      );

    res.json(updatedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration =
      await registrationsService.getRegistrationById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    await registrationsService.deleteRegistration(id);

    res.json({
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
};