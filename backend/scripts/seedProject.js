import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Blog from '../models/Blog.js';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Clear existing data
    console.log('Cleaning up existing data...');
    await User.deleteMany({ email: { $in: ['ayesha@genius.com', 'tanisha@genius.com', 'arjun@genius.com'] } });
    
    // 2. Create Expert Personas
    console.log('Creating expert personas...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('genius123', salt);

    const experts = await User.insertMany([
      {
        name: 'Ayesha Topiwala',
        email: 'ayesha@genius.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha',
        title: 'Lead AI/ML Engineer',
        bio: 'Specializing in Large Language Models and Neural Architecture. Building the future of human-AI collaboration.',
        interests: ['AI', 'LLM', 'Python', 'PyTorch']
      },
      {
        name: 'Tanisha Gupta',
        email: 'tanisha@genius.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanisha',
        title: 'Senior Frontend Architect',
        bio: 'Obsessed with performance, micro-frontends, and premium UI/UX. Making the web beautiful and fast.',
        interests: ['React', 'Next.js', 'WebPerf', 'UI/UX']
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@genius.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
        title: 'Senior Cloud Architect',
        bio: 'Kubernetes, Go, and Distributed Systems. Scaling applications to millions of users with zero downtime.',
        interests: ['Cloud', 'DevOps', 'Go', 'Kubernetes']
      }
    ]);

    console.log('Experts created successfully!');

    // 3. Create Professional Blogs with valid categories
    console.log('Generating technical blog content...');
    const blogs = [
      {
        title: 'The Future of LLMs: Beyond Transformers',
        content: 'Large Language Models have revolutionized AI, but the Transformer architecture is just the beginning. In this post, we explore state-space models and new efficient attention mechanisms. The shift from quadratic complexity to linear performance is the next big frontier for AI researchers everywhere.',
        category: 'AI Basics',
        tags: ['AI', 'LLM', 'Research'],
        status: 'published',
        author: experts[0]._id,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
      },
      {
        title: 'Micro-Frontends: Scaling Large React Apps',
        content: 'As teams grow, monolith frontends become a bottleneck. Learn how we use Module Federation to build independent, deployable frontend modules that work seamlessly together. This approach allows multiple teams to ship features independently without breaking the entire platform.',
        category: 'Tutorials',
        tags: ['React', 'Architecture', 'WebDev'],
        status: 'published',
        author: experts[1]._id,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'
      },
      {
        title: 'Kubernetes in Production: The Hard Lessons',
        content: 'Managing K8s at scale is not just about YAML. It is about observability, security, and resource management. Here are the 5 things we wish we knew before going live. From network policies to pod priority classes, managing a production cluster requires deep infrastructure knowledge.',
        category: 'Projects',
        tags: ['Cloud', 'K8s', 'DevOps'],
        status: 'published',
        author: experts[2]._id,
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070&auto=format&fit=crop'
      },
      {
        title: 'Deep Dive into React Server Components',
        content: 'RSC is the biggest shift in React history. We explore how it changes data fetching, bundle sizes, and the overall developer experience in modern web apps. By moving component logic to the server, we can reduce the client-side JavaScript burden and improve initial load times significantly.',
        category: 'AI Basics',
        tags: ['React', 'NextJS', 'WebDev'],
        status: 'published',
        author: experts[1]._id,
        image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop'
      },
      {
        title: 'Building Scalable APIs with Go and Gin',
        content: 'Go is the language of the cloud. In this tutorial, we build a high-performance REST API using the Gin framework. We cover everything from request binding to middleware and database integration with GORM.',
        category: 'Tutorials',
        tags: ['Go', 'Backend', 'API'],
        status: 'published',
        author: experts[2]._id,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop'
      }
    ];

    await Blog.insertMany(blogs);
    console.log('Professional blogs created successfully!');

    console.log('\n--- SUCCESS: PROJECT RESTORED ---');
    console.log('Login Email: ayesha@genius.com');
    console.log('Password: genius123');
    console.log('--------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
