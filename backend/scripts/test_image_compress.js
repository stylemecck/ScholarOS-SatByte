const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testCompress() {
  const filePath = path.join(__dirname, 'test_image.jpg');
  
  // Create a dummy image if it doesn't exist
  if (!fs.existsSync(filePath)) {
    // This is not a real JPEG but should trigger sharp's error or success
    fs.writeFileSync(filePath, Buffer.from('dummy image content'));
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('quality', '50');

  try {
    const response = await axios.post('http://localhost:5001/api/image/compress', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer'
    });
    console.log('Success! Response size:', response.data.length);
  } catch (err) {
    console.error('Failed:', err.response ? err.response.data.toString() : err.message);
  }
}

testCompress();
