const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { listApplicants, updateApplicant } = require("../controllers/applicantController");

const router = express.Router();

router.get("/:jobId/applicants", verifyToken, listApplicants);
router.patch("/:jobId/applicants/:applicationId", verifyToken, updateApplicant);

module.exports = router;
