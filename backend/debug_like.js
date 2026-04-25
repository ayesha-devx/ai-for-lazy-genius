import axios from 'axios';

const debugLikeAPI = async () => {
  const baseURL = 'http://localhost:5000/api';
  let token = '';
  let blogId = '';

  try {
    console.log('--- 1. Logging in ---');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'ayesha@test.com',
      password: '123456'
    });
    token = loginRes.data.token;
    
    console.log('--- 2. Fetching a Blog ---');
    const blogsRes = await axios.get(`${baseURL}/blogs`);
    if (blogsRes.data.length === 0) {
      console.log('No blogs found to test likes.');
      return;
    }
    blogId = blogsRes.data[0]._id;
    console.log(`Testing Like on Blog ID: ${blogId}`);

    console.log('--- 3. Sending LIKE request ---');
    const likeRes = await axios.put(`${baseURL}/blogs/${blogId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Response:', likeRes.data);
    console.log('Likes Count:', likeRes.data.likes?.length);

  } catch (error) {
    console.error('DEBUG ERROR:', error.response ? error.response.data : error.message);
  }
};

debugLikeAPI();
