const express = require("express");
const { getProfile, getProfileByUserId, upsertProfile } = require("../controllers/profileController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, upsertProfile);
router.get("/:userId", verifyToken, getProfileByUserId);

module.exports = router;
