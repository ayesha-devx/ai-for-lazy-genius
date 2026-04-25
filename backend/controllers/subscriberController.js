import Subscriber from '../models/Subscriber.js';

/**
 * @desc    Subscribe a new user to the newsletter
 * @route   POST /api/subscribe
 * @access  Public
 */
export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    // Save new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!'
    });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
