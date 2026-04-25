import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Blog from '../models/Blog.js';

const wipeData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Remove the expert users I created
    console.log('Removing expert users...');
    await User.deleteMany({ email: { $in: ['ayesha@genius.com', 'tanisha@genius.com', 'arjun@genius.com'] } });
    
    // 2. Remove all blogs (to give you a clean slate)
    console.log('Removing all blogs...');
    await Blog.deleteMany({});

    console.log('\n--- SUCCESS: DATABASE CLEARED ---');
    console.log('Expert users and all blogs have been removed.');
    console.log('You can now log in and create your own content!');
    console.log('--------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Wipe Error:', error.message);
    process.exit(1);
  }
};

wipeData();
