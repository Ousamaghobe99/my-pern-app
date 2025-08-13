import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let userId = '';

// Test data
const testUser = {
  matricule: 'TEST001',
  email: 'test@factory.com',
  password: 'TestPass123',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+1234567890'
};

const testLocation = {
  name: 'Test Location',
  description: 'A test location for API testing',
  address: 'Test Building, Floor 1'
};

const testInterface = {
  interfaceName: 'Test Interface',
  serialNumber: 9999,
  description: 'A test interface for API testing',
  type: 'Test Equipment',
  qrCodeData: 'TEST-INTERFACE-001'
};

// Helper function to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@factory.com',
      password: 'admin123'
    });
    
    authToken = response.data.data.token;
    userId = response.data.data.user.id;
    console.log('✅ Login successful');
    console.log('   User:', response.data.data.user.firstName, response.data.data.user.lastName);
    console.log('   Role:', response.data.data.user.role.name);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetProfile() {
  console.log('\n👤 Testing Get Profile...');
  try {
    const response = await authRequest('GET', '/api/auth/profile');
    console.log('✅ Profile retrieved successfully');
    console.log('   Name:', response.data.data.firstName, response.data.data.lastName);
    return true;
  } catch (error) {
    console.error('❌ Get profile failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetUsers() {
  console.log('\n👥 Testing Get Users...');
  try {
    const response = await authRequest('GET', '/api/users?page=1&limit=5');
    console.log('✅ Users retrieved successfully');
    console.log('   Total users:', response.data.pagination.total);
    console.log('   Users on page:', response.data.data.length);
    return true;
  } catch (error) {
    console.error('❌ Get users failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateLocation() {
  console.log('\n📍 Testing Create Location...');
  try {
    const response = await authRequest('POST', '/api/locations', testLocation);
    console.log('✅ Location created successfully');
    console.log('   Location:', response.data.data.name);
    testLocation.id = response.data.data.id;
    return true;
  } catch (error) {
    console.error('❌ Create location failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetLocations() {
  console.log('\n📍 Testing Get Locations...');
  try {
    const response = await authRequest('GET', '/api/locations');
    console.log('✅ Locations retrieved successfully');
    console.log('   Total locations:', response.data.pagination.total);
    return true;
  } catch (error) {
    console.error('❌ Get locations failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateInterface() {
  console.log('\n🔧 Testing Create Interface...');
  try {
    // Set the location ID for the interface
    testInterface.currentLocationId = testLocation.id;
    
    const response = await authRequest('POST', '/api/interfaces', testInterface);
    console.log('✅ Interface created successfully');
    console.log('   Interface:', response.data.data.interfaceName);
    testInterface.id = response.data.data.id;
    return true;
  } catch (error) {
    console.error('❌ Create interface failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetInterfaces() {
  console.log('\n🔧 Testing Get Interfaces...');
  try {
    const response = await authRequest('GET', '/api/interfaces');
    console.log('✅ Interfaces retrieved successfully');
    console.log('   Total interfaces:', response.data.pagination.total);
    return true;
  } catch (error) {
    console.error('❌ Get interfaces failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateMaintenanceTicket() {
  console.log('\n🔧 Testing Create Maintenance Ticket...');
  try {
    const ticketData = {
      interfaceId: testInterface.id,
      type: 'Corrective',
      description: 'Test maintenance ticket for API testing',
      priority: 'Medium',
      reportedById: userId
    };
    
    const response = await authRequest('POST', '/api/maintenance', ticketData);
    console.log('✅ Maintenance ticket created successfully');
    console.log('   Ticket ID:', response.data.data.id);
    return true;
  } catch (error) {
    console.error('❌ Create maintenance ticket failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetMaintenanceTickets() {
  console.log('\n🔧 Testing Get Maintenance Tickets...');
  try {
    const response = await authRequest('GET', '/api/maintenance');
    console.log('✅ Maintenance tickets retrieved successfully');
    console.log('   Total tickets:', response.data.pagination.total);
    return true;
  } catch (error) {
    console.error('❌ Get maintenance tickets failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testStatistics() {
  console.log('\n📊 Testing Statistics Endpoints...');
  try {
    const [interfaceStats, locationStats, maintenanceStats, userStats] = await Promise.all([
      authRequest('GET', '/api/interfaces/statistics'),
      authRequest('GET', '/api/locations/statistics'),
      authRequest('GET', '/api/maintenance/statistics'),
      authRequest('GET', '/api/users/statistics')
    ]);
    
    console.log('✅ All statistics retrieved successfully');
    console.log('   Interface stats:', interfaceStats.data.data.total, 'total');
    console.log('   Location stats:', locationStats.data.data.total, 'total');
    console.log('   Maintenance stats:', maintenanceStats.data.data.total, 'total');
    console.log('   User stats:', userStats.data.data.total, 'total');
    return true;
  } catch (error) {
    console.error('❌ Get statistics failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...');
  
  const tests = [
    testHealthCheck,
    testLogin,
    testGetProfile,
    testGetUsers,
    testCreateLocation,
    testGetLocations,
    testCreateInterface,
    testGetInterfaces,
    testCreateMaintenanceTicket,
    testGetMaintenanceTickets,
    testStatistics
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('❌ Test error:', error.message);
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
}

// Run tests
runTests().catch(console.error);

