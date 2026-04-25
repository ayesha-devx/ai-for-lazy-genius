import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const blogSchema = new mongoose.Schema({}, { strict: false });
const Blog = mongoose.model('Blog', blogSchema, 'blogs');

async function checkBlogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const blogs = await Blog.find({}).limit(10);
    console.log('Total blogs found:', blogs.length);

    blogs.forEach(blog => {
      console.log(`Title: ${blog.title}, Status: ${blog.status}, Raw: ${JSON.stringify(blog.toObject())}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkBlogs();
