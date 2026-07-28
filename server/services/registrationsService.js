const pool = require("../db");

const getAllRegistrations = async () => {
  const result = await pool.query(`
    SELECT
      r.id,
      r.vendor_id,
      CONCAT(v.first_name, ' ', v.last_name) AS vendor_name,
      r.year,
      r.created_at
    FROM registrations r
    JOIN vendors v ON r.vendor_id = v.id
    ORDER BY r.year DESC, v.last_name, v.first_name
  `);

  return result.rows;
};

const getRegistrationById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.vendor_id,
      CONCAT(v.first_name, ' ', v.last_name) AS vendor_name,
      r.year,
      r.created_at
    FROM registrations r
    JOIN vendors v ON r.vendor_id = v.id
    WHERE r.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const registrationExists = async (vendorId, year) => {
  const result = await pool.query(
    `
    SELECT *
    FROM registrations
    WHERE vendor_id = $1
      AND year = $2
    `,
    [vendorId, year]
  );

  return result.rows[0];
};

const createRegistration = async (vendorId, year) => {
  const result = await pool.query(
    `
    INSERT INTO registrations
    (
      vendor_id,
      year
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [vendorId, year]
  );

  return result.rows[0];
};

const updateRegistration = async (id, vendorId, year) => {
  const result = await pool.query(
    `
    UPDATE registrations
    SET
      vendor_id = $1,
      year = $2
    WHERE id = $3
    RETURNING *
    `,
    [vendorId, year, id]
  );

  return result.rows[0];
};

const deleteRegistration = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM registrations
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

const vendorExists = async (vendorId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM vendors
    WHERE id = $1
    `,
    [vendorId]
  );

  return result.rows[0];
};

module.exports = {
  getAllRegistrations,
  getRegistrationById,
  registrationExists,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  vendorExists,
};