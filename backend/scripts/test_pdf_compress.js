const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testPdfCompress() {
  const filePath = path.join(__dirname, 'test.pdf');
  
  // Create a dummy PDF if it doesn't exist
  if (!fs.existsSync(filePath)) {
    // A very minimal valid PDF
    const minimalPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<>>\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000215 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n310\n%%EOF');
    fs.writeFileSync(filePath, minimalPdf);
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:5001/api/pdf/compress', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer'
    });
    console.log('Success! Response size:', response.data.length);
  } catch (err) {
    console.error('Failed:', err.response ? err.response.data.toString() : err.message);
  }
}

testPdfCompress();
