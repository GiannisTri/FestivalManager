const pool = require("../db");

const getFestivals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM festivals
      ORDER BY start_date
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getFestivals,
};