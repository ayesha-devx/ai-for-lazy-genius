import axios from 'axios';

const debugBookmarkAPI = async () => {
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
      console.log('No blogs found to test bookmarks.');
      return;
    }
    blogId = blogsRes.data[0]._id;
    console.log(`Testing Bookmark on Blog ID: ${blogId}`);

    console.log('--- 3. Sending BOOKMARK request ---');
    const bookmarkRes = await axios.put(`${baseURL}/blogs/${blogId}/bookmark`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Response (Updated Bookmarks):', bookmarkRes.data);

  } catch (error) {
    console.error('DEBUG ERROR:', error.response ? error.response.data : error.message);
  }
};

debugBookmarkAPI();
