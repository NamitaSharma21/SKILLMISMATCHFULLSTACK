import Progress from "../models/Progress.js";

export const saveProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course, domain, roadmapSteps } = req.body;

    let progress = await Progress.findOne({ userId, course, domain });

    if (!progress) {
      progress = new Progress({
        userId,
        course,
        domain,
        roadmapSteps,
        completedSteps: [],
        unlockedSteps: [roadmapSteps?.[0]],
        scores: {},
      });
    } else {
      if (roadmapSteps?.length) {
        progress.roadmapSteps = roadmapSteps;
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
      message: "Error saving progress",
    });
  }
};

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
      return res.status(200).json({
        success: true,
        progress: null,
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

export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;

    const { course, domain, step, score, totalQuestions, roadmapSteps } =
      req.body;

    const progress = await Progress.findOne({ userId, course, domain });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    const passMark = Math.ceil((totalQuestions || 5) * 0.6);

    progress.scores[step] = score;

    if (score >= passMark) {
      if (!progress.completedSteps.includes(step)) {
        progress.completedSteps.push(step);
      }

      const index = progress.roadmapSteps.indexOf(step);

      if (index !== -1 && index < progress.roadmapSteps.length - 1) {
        const nextStep = progress.roadmapSteps[index + 1];

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