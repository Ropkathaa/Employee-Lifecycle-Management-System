const express = require("express");
const router = express.Router();

const employeeRoutes = require("./employeeRoutes");

// Employee Dashboard Routes
router.use("/employee", employeeRoutes);

module.exports = router;