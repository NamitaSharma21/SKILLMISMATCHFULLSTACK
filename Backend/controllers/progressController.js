import Progress from "../models/Progress.js";

/**
 * Create or update progress when roadmap starts
 */
export const saveProgress = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { course, domain, roadmapSteps } = req.body;

    let progress = await Progress.findOne({ userId, course, domain });

    if (!progress) {
      progress = new Progress({
        userId,
        course,
        domain,
        roadmapSteps,
        completedSteps: [],
        unlockedSteps: [roadmapSteps?.[0]], // first step unlocked
        scores: {},
      });
    } else {
      progress.roadmapSteps = roadmapSteps;
    }

    await progress.save();

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error saving progress",
    });
  }
};

/**
 * Get user progress
 */
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course, domain } = req.params;

    const progress = await Progress.findOne({
      userId,
      course,
      domain,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found",
      });
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching progress",
    });
  }
};

/**
 * Submit test result + unlock logic
 */
export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      course,
      domain,
      step,
      score,
      roadmapSteps,
    } = req.body;

    const progress = await Progress.findOne({
      userId,
      course,
      domain,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    const passMark = Math.ceil(5 * 0.6); // assuming 5 questions

    // update score
    progress.scores[step] = score;

    // mark completed
    if (score >= passMark) {
      if (!progress.completedSteps.includes(step)) {
        progress.completedSteps.push(step);
      }

      // unlock next step
      const index = roadmapSteps.indexOf(step);

      if (index !== -1 && index + 1 < roadmapSteps.length) {
        const nextStep = roadmapSteps[index + 1];

        if (!progress.unlockedSteps.includes(nextStep)) {
          progress.unlockedSteps.push(nextStep);
        }
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error submitting test",
    });
  }
};