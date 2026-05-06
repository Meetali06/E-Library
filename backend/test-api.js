const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    // Test 1: Admin Login
    console.log('=== Testing Admin Login ===');
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('Admin login successful!');
    const adminToken = adminLogin.data.token;
    console.log('Token:', adminToken.substring(0, 20) + '...');

    // Test 2: Register a new student
    console.log('\n=== Testing Student Registration ===');
    const studentData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      department: 'Computer Science'
    };
    
    const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, studentData);
    console.log('Student registered successfully!');
    console.log('User:', registerRes.data.user);

    // Test 3: Get all users (admin only)
    console.log('\n=== Testing Get All Users (Admin) ===');
    const usersRes = await axios.get(`${BASE_URL}/api/users`, {
      headers: { 'x-auth-token': adminToken }
    });
    console.log('Users fetched successfully!');
    console.log('Total users:', usersRes.data.length);
    console.log('Users:', JSON.stringify(usersRes.data, null, 2));

    // Test 4: Student Login
    console.log('\n=== Testing Student Login ===');
    const studentLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    console.log('Student login successful!');
    console.log('User:', studentLogin.data.user);

    console.log('\n=== All tests passed! ===');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
