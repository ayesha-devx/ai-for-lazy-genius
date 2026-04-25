import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';

dotenv.config();

const migrateLikes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for migration...');

    const blogs = await Blog.find({});
    console.log(`Checking ${blogs.length} blogs...`);

    let updatedCount = 0;
    for (let blog of blogs) {
      if (!Array.isArray(blog.likes)) {
        blog.likes = [];
        await blog.save();
        updatedCount++;
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} blogs.`);
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrateLikes();
