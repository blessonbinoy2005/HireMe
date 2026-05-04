const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { companyAuth, requireRole } = require("../middleware/companyAuth");
const {
    createCompany,
    getMyCompanies,
    getCompany,
    updateCompany,
} = require("../controllers/companyController");

const router = express.Router();

router.post("/", verifyToken, createCompany);
router.get("/mine", verifyToken, getMyCompanies);
router.get("/:companyId", verifyToken, getCompany);
router.put("/:companyId", verifyToken, companyAuth, requireRole("admin"), updateCompany);

module.exports = router;
