const express = require("express");
const router = express.Router();

const {
  saveProgress,
  getProgress,
  submitTest,
} = require("../controllers/progressController");

const auth = require("../middleware/authMiddleware");

// ================= SAVE PROGRESS =================
// when roadmap is created or updated
router.post("/save", auth, saveProgress);

// ================= GET PROGRESS =================
// after login / refresh roadmap restore
router.get("/:course/:domain", auth, getProgress);

// ================= SUBMIT TEST =================
// score + unlock next step
router.post("/submit", auth, submitTest);

module.exports = router;