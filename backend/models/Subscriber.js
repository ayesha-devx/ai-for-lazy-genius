import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
