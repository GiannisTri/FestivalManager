const express = require("express");
const cors = require("cors");
require("dotenv").config();

const festivalsRoutes = require("./routes/festivals");
const vendorsRoutes = require("./routes/vendors");
const registrationsRoutes = require("./routes/registrations");
const paymentsRoutes = require("./routes/payments");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Festival Manager API");
});

app.use("/api/festivals", festivalsRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});