const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('http://localhost:8080/auth/signup', {
      name: 'Test Tenant',
      email: 'tenant' + Date.now() + '@test.com',
      password: 'password123',
      companyName: 'Test Company'
    });
    console.log('Signup success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Signup error (500 expected):', error.response.status, error.response.data);
    } else {
      console.error('Signup error:', error.message);
    }
  }
}

testSignup();
