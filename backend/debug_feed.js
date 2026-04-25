import axios from 'axios';

const debugFeed = async () => {
  const baseURL = 'http://localhost:5000/api';
  let token = '';

  try {
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'ayesha@test.com',
      password: '123456'
    });
    token = loginRes.data.token;
    
    console.log('--- Checking Interests ---');
    const userRes = await axios.get(`${baseURL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const allInteracted = [...(userRes.data.likedBlogs || []), ...(userRes.data.bookmarks || [])];
    const tags = allInteracted.flatMap(b => b.tags || []);
    console.log('Detected Tags in your Liked/Saved posts:', [...new Set(tags)]);

    console.log('--- Checking Other Blogs ---');
    const allBlogs = await axios.get(`${baseURL}/blogs`);
    console.log('Total blogs in DB:', allBlogs.data.length);

  } catch (error) {
    console.error('DEBUG ERROR:', error);
  }
};

debugFeed();
