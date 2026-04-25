import Progress from '../models/progressModel.js';

const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Evaluate and award badges
const evaluateBadges = (progress) => {
  const newBadges = [];
  const addBadge = (badgeName) => {
    if (!progress.badges.includes(badgeName) && !newBadges.includes(badgeName)) {
      progress.badges.push(badgeName);
      newBadges.push(badgeName);
    }
  };

  if (progress.streakCount >= 3) addBadge("🔥 3 Day Streak");
  if (progress.streakCount >= 7) addBadge("🔥 7 Day Streak");
  if (progress.streakCount >= 30) addBadge("🔥 30 Day Streak");
  if (progress.totalArticlesRead >= 1) addBadge("📖 First Read");
  if (progress.totalArticlesRead >= 10) addBadge("📚 10 Blogs Completed");
  if (progress.totalArticlesRead >= 50) addBadge("📚 Reader Pro");
  if (progress.totalNotesSaved >= 1) addBadge("📝 First Note");
  if (progress.totalNotesSaved >= 5) addBadge("🧠 Note Master");
  
  return newBadges;
};

export const updateReadingProgress = async (req, res) => {
  try {
    const { action } = req.body; // 'read_blog' or 'save_note'
    
    let progress = await Progress.findOne({ userId: req.user._id });
    
    if (!progress) {
      progress = new Progress({ userId: req.user._id });
    }

    const today = getStartOfDay(new Date());
    let streakIncreased = false;

    if (action === 'read_blog') {
      progress.totalArticlesRead += 1;
      progress.weeklyCompleted += 1;

      if (!progress.lastReadDate) {
        progress.streakCount = 1;
        progress.lastReadDate = today;
        streakIncreased = true;
      } else {
        const lastRead = getStartOfDay(progress.lastReadDate);
        const diffTime = Math.abs(today - lastRead);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          progress.streakCount += 1;
          progress.lastReadDate = today;
          streakIncreased = true;
        } else if (diffDays > 1) {
          progress.streakCount = 1; // reset streak
          progress.lastReadDate = today;
          streakIncreased = true; // Still technically increased to 1 today
        }
      }
    } else if (action === 'save_note') {
      progress.totalNotesSaved += 1;
    }

    const newBadges = evaluateBadges(progress);

    await progress.save();

    res.status(200).json({
      success: true,
      streakIncreased,
      newBadges,
      progress
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: 'Server error getting progress' });
  }
};
