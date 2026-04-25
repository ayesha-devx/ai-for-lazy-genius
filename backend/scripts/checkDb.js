import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Blog from '../models/Blog.js';

const checkDb = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    const userCount = await User.countDocuments();
    console.log(`Total Users in DB: ${userCount}`);

    const users = await User.find().select('name email');
    console.log('\n--- User List ---');
    users.forEach(u => {
      console.log(`Name: ${u.name} | Email: ${u.email}`);
    });

    const blogCount = await Blog.countDocuments();
    console.log(`\nTotal Blogs in DB: ${blogCount}`);
    
    const blogs = await Blog.find().select('title status author');
    console.log('\n--- Blog List ---');
    blogs.forEach(b => {
      console.log(`Title: ${b.title} | Status: ${b.status}`);
    });

    console.log('\n--- Diagnostic Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Database Error:', error.message);
    process.exit(1);
  }
};

checkDb();
