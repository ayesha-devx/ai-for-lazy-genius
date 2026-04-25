import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const findUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    users.forEach(user => {
      console.log(`ID: ${user._id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

findUsers();
