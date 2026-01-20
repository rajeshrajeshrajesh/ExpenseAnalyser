const express = require("express");
const router = express.Router();
const { getSummaryReport, getTrendsReport, getCategoryReport } = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware");

router.get("/summary", auth, getSummaryReport);
router.get("/trends", auth, getTrendsReport);
router.get("/category",auth, getCategoryReport);

module.exports = router;
