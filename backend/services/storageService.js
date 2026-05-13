const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

class StorageService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Save a buffer to temporary storage
   * @param {Buffer} buffer - File data
   * @param {string} originalName - Original filename
   * @returns {Promise<string>} - Path to the saved file
   */
  async saveBuffer(buffer, originalName) {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(originalName);
    const fileName = `${hash}${ext}`;
    const filePath = path.join(this.tempDir, fileName);

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) return reject(err);
        resolve(filePath);
      });
    });
  }

  /**
   * Delete a file from storage
   * @param {string} filePath - Path to file
   */
  async deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`StorageService Delete Error: ${err.message}`);
      });
    }
  }

  /**
   * Generate a secure download URL (mock)
   * In a real app, this would be an S3 signed URL
   */
  getDownloadUrl(fileName) {
    return `/api/v1/storage/download/${fileName}`;
  }

  /**
   * Cleanup old files (older than 2 hours)
   */
  async cleanup() {
    const now = Date.now();
    const expiry = 2 * 60 * 60 * 1000; // 2 hours

    fs.readdir(this.tempDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          if (now - stats.mtimeMs > expiry) {
            this.deleteFile(filePath);
          }
        });
      });
    });
  }
}

module.exports = new StorageService();
