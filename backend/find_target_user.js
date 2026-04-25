import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const findUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const user = await User.findById('69e876b1de11e764b557fc04');
    if (user) {
      console.log('User found:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      // We can't see the password hash, but we might be able to reset it if needed
      // Or just check if there's a common password used in seeds
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

findUser();
