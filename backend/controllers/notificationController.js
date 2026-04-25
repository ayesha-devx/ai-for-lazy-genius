import Notification from '../models/Notification.js';

/**
 * @desc    Utility to create a notification internally
 */
export const createNotification = async (data) => {
  try {
    // Avoid self-notifications
    if (data.user.toString() === data.sender.toString()) return;

    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * @desc    Get all notifications for current user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('sender', 'name email avatar profileImage')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify ownership
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
