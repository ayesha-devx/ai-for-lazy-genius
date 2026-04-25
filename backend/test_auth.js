import axios from 'axios';

const testAuth = async () => {
  const baseURL = 'http://localhost:5000/api/auth';
  
  try {
    console.log('--- Testing Registration ---');
    const registerRes = await axios.post(`${baseURL}/register`, {
      name: 'Ayesha',
      email: 'ayesha@test.com',
      password: '123456'
    });
    console.log('Registration Success:', registerRes.data);
  } catch (error) {
    if (error.response && error.response.data.message === 'User already exists') {
      console.log('Registration Note: User already exists (OK)');
    } else {
      console.error('Registration Error:', error.response ? error.response.data : error.message);
    }
  }

  try {
    console.log('\n--- Testing Login ---');
    const loginRes = await axios.post(`${baseURL}/login`, {
      email: 'ayesha@test.com',
      password: '123456'
    });
    console.log('Login Success:', loginRes.data);
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
  }
};

testAuth();
