async function testBackendConnection(apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/debug/health`);
    const data = await response.json();
    console.log('Backend connection test:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
}

export default testBackendConnection; 