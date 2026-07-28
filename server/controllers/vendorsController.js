const vendorsService = require("../services/vendorsService");

const getVendors = async (req, res) => {
  try {
    const vendors = await vendorsService.getAllVendors();
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await vendorsService.getVendorById(id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    res.json(vendor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createVendor = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required.",
      });
    }

    const vendor = await vendorsService.createVendor(req.body);

    res.status(201).json(vendor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required.",
      });
    }

    const existingVendor = await vendorsService.getVendorById(id);

    if (!existingVendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    const updatedVendor = await vendorsService.updateVendor(id, req.body);

    res.json(updatedVendor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVendor = await vendorsService.getVendorById(id);

    if (!existingVendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    await vendorsService.deleteVendor(id);

    res.json({
      message: "Vendor deleted successfully.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};