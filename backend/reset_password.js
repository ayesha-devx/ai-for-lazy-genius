import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: 'ayesha@test.com' });
    if (user) {
      user.password = '123456'; // The pre-save hook will hash this automatically
      await user.save();
      console.log('Password for ayesha@test.com reset to 123456');
    } else {
      console.log('User ayesha@test.com not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetPassword();
