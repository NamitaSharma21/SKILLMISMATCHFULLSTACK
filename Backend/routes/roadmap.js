const express = require("express");
const router = express.Router();
const Roadmap = require("../models/Roadmap");

router.post("/save-roadmap", async (req, res) => {
  try {
    const { userId, course, domain, score, roadmap } = req.body;

    const cleanRoadmap = (roadmap || [])
      .map((item) => item?.toString().trim())
      .filter((item) => item && item.length > 0);

    const newRoadmap = new Roadmap({
      userId,
      course,
      domain,
      score,
      roadmap: cleanRoadmap,
    });

    const saved = await newRoadmap.save();

    return res.json({
      success: true,
      message: "Saved successfully",
      data: saved,
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "DB error",
    });
  }
});

module.exports = router;