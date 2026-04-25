import axios from 'axios';

const testBlogAPI = async () => {
  const baseURL = 'http://localhost:5000/api';
  let token = '';
  let blogId = '';

  try {
    console.log('--- 1. Logging in to get token ---');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'ayesha@test.com',
      password: '123456'
    });
    token = loginRes.data.token;
    console.log('Login Success. Token acquired.');

    console.log('\n--- 2. Creating a Blog (Protected) ---');
    const createRes = await axios.post(`${baseURL}/blogs`, {
      title: 'My First Blog on AI',
      content: 'Artificial Intelligence is revolutionizing the world of lazy geniuses.',
      tags: ['AI', 'Productivity', 'Future']
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    blogId = createRes.data._id;
    console.log('Blog Created Success:', createRes.data);

    console.log('\n--- 3. Getting all Blogs ---');
    const allBlogsRes = await axios.get(`${baseURL}/blogs`);
    console.log(`Fetched ${allBlogsRes.data.length} blogs.`);

    console.log('\n--- 4. Getting Single Blog by ID ---');
    const singleBlogRes = await axios.get(`${baseURL}/blogs/${blogId}`);
    console.log('Single Blog Data:', singleBlogRes.data);

    console.log('\n--- API TEST COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
};

testBlogAPI();
