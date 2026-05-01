const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const pythonData = {
  userName: "Test User",
  exam: "CUET PG",
  predictedRank: "1000",
  predictedPercentile: "95",
  admissionChances: "High",
  analysis: "This is a test analysis.",
  outputPath: path.join(__dirname, "test_output.pdf")
};

const inputDataPath = path.join(__dirname, "test_input.json");
fs.writeFileSync(inputDataPath, JSON.stringify(pythonData));

console.log("Starting Python process...");
const pythonProcess = spawn('python', [
  path.join(__dirname, "utils/pdf_generator.py"),
  inputDataPath
]);

let errorData = '';
pythonProcess.stderr.on('data', (data) => {
    console.log("STDERR:", data.toString());
    errorData += data.toString();
});

pythonProcess.stdout.on('data', (data) => {
    console.log("STDOUT:", data.toString());
});

pythonProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  if (fs.existsSync(inputDataPath)) fs.unlinkSync(inputDataPath);
  if (code === 0 && fs.existsSync(pythonData.outputPath)) {
    console.log("SUCCESS: PDF created at " + pythonData.outputPath);
  } else {
    console.log("FAILURE: PDF not created or error occurred.");
  }
});
