const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
    createCompany,
    getMyCompanies,
    getCompany,
} = require("../controllers/companyController");

const router = express.Router();

router.post("/", verifyToken, createCompany);
router.get("/mine", verifyToken, getMyCompanies);
router.get("/:id", verifyToken, getCompany);

module.exports = router;
