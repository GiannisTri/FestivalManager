const pool = require("../db");

const getAllPayments = async () => {
  const result = await pool.query(`
    SELECT
      p.id,
      p.registration_id,
      p.festival_id,
      CONCAT(v.first_name, ' ', v.last_name) AS vendor_name,
      r.year,
      f.name AS festival_name,
      p.position,
      p.meters,
      p.amount,
      p.taxes,
      p.created_at
    FROM payments p
    JOIN registrations r ON p.registration_id = r.id
    JOIN vendors v ON r.vendor_id = v.id
    JOIN festivals f ON p.festival_id = f.id
    ORDER BY
      r.year DESC,
      f.name,
      v.last_name,
      v.first_name
  `);

  return result.rows;
};

const getPaymentById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.registration_id,
      p.festival_id,
      CONCAT(v.first_name, ' ', v.last_name) AS vendor_name,
      r.year,
      f.name AS festival_name,
      p.position,
      p.meters,
      p.amount,
      p.taxes,
      p.created_at
    FROM payments p
    JOIN registrations r ON p.registration_id = r.id
    JOIN vendors v ON r.vendor_id = v.id
    JOIN festivals f ON p.festival_id = f.id
    WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const registrationExists = async (registrationId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM registrations
    WHERE id = $1
    `,
    [registrationId]
  );

  return result.rows[0];
};

const festivalExists = async (festivalId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM festivals
    WHERE id = $1
    `,
    [festivalId]
  );

  return result.rows[0];
};

const createPayment = async (payment) => {
  const {
    registration_id,
    festival_id,
    position,
    meters,
    amount,
    taxes,
  } = payment;

  const result = await pool.query(
    `
    INSERT INTO payments
    (
      registration_id,
      festival_id,
      position,
      meters,
      amount,
      taxes
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      registration_id,
      festival_id,
      position,
      meters,
      amount,
      taxes ?? 0,
    ]
  );

  return result.rows[0];
};

const updatePayment = async (id, payment) => {
  const {
    registration_id,
    festival_id,
    position,
    meters,
    amount,
    taxes,
  } = payment;

  const result = await pool.query(
    `
    UPDATE payments
    SET
      registration_id = $1,
      festival_id = $2,
      position = $3,
      meters = $4,
      amount = $5,
      taxes = $6
    WHERE id = $7
    RETURNING *
    `,
    [
      registration_id,
      festival_id,
      position,
      meters,
      amount,
      taxes ?? 0,
      id,
    ]
  );

  return result.rows[0];
};

const deletePayment = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM payments
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllPayments,
  getPaymentById,
  registrationExists,
  festivalExists,
  createPayment,
  updatePayment,
  deletePayment,
};
