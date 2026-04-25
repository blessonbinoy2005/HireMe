const express = require("express");
const { getProfile, upsertProfile } = require("../controllers/profileController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, upsertProfile);

module.exports = router;
