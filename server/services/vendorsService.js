const pool = require("../db");

const getAllVendors = async () => {
  const result = await pool.query(`
    SELECT *
    FROM vendors
    ORDER BY last_name, first_name
  `);

  return result.rows;
};

const getVendorById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM vendors
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const createVendor = async (vendor) => {
  const {
    first_name,
    last_name,
    phone,
    email,
  } = vendor;

  const result = await pool.query(
    `
    INSERT INTO vendors
    (
      first_name,
      last_name,
      phone,
      email
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      first_name,
      last_name,
      phone,
      email,
    ]
  );

  return result.rows[0];
};

const updateVendor = async (id, vendor) => {
  const {
    first_name,
    last_name,
    phone,
    email,
  } = vendor;

  const result = await pool.query(
    `
    UPDATE vendors
    SET
      first_name = $1,
      last_name = $2,
      phone = $3,
      email = $4
    WHERE id = $5
    RETURNING *
    `,
    [
      first_name,
      last_name,
      phone,
      email,
      id,
    ]
  );

  return result.rows[0];
};

const deleteVendor = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM vendors
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};