const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util'); // Native Node utility to parse flags
const puppeteer = require('puppeteer');
const JSON5 = require('json5'); 
const generateTemplate = require('./template.js');

(async () => {
  // 1. Configure and parse command-line arguments and flags
  const options = {
    output: { type: 'string', short: 'o' }
  };
  
  const { values, positionals } = parseArgs({ 
    options, 
    strict: false // Allows positional arguments alongside flags
  });

  // Positionals are non-flag arguments (e.g., node src/render.js software_eng.json)
  const jsonFilename = positionals[0] || 'resume.json';
  
  // Resolve the absolute path to the data file inside the data/ folder
  const jsonPath = path.join(__dirname, '../data', jsonFilename);

  // Robust error handling if the specified file doesn't exist
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: File not found at ${jsonPath}`);
    console.error(`💡 Make sure the file exists inside your 'data/' directory.`);
    process.exit(1);
  }

  console.log(`📄 Parsing data/${jsonFilename} via JSON5...`);
  const rawJsonContent = fs.readFileSync(jsonPath, 'utf8');
  const resume = JSON5.parse(rawJsonContent);

  // Generate the raw HTML string completely in-memory
  const htmlContent = generateTemplate(resume);

  // 2. Determine target distribution folder path (handles base 'dist/' or 'dist/COMPANY')
  let distDir = path.join(__dirname, '../dist');
  if (values.output) {
    distDir = path.join(distDir, values.output);
  }

  // Automatically create the target folder structure if it doesn't exist yet
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log(`📁 Created target directory: ${path.relative(path.join(__dirname, '..'), distDir)}`);
  }

  // Dynamically extract name from JSON and format it
  const formattedName = resume.basics.name.toUpperCase().replace(/\s+/g, '_');
  
  // Set up filenames for both the PDF and the copied JSON configuration
  const pdfFileName = `${formattedName}_RESUME.pdf`;
  const jsonFileName = `${formattedName}_RESUME.json`;
  
  const fullPdfPath = path.join(distDir, pdfFileName);
  const fullJsonPath = path.join(distDir, jsonFileName);

  // Save a copy of the source JSON data configuration right next to the layout output
  fs.writeFileSync(fullJsonPath, rawJsonContent, 'utf8');
  console.log(`💾 Snapshot data saved as: ${jsonFileName}`);

  console.log(`🚀 Rendering PDF layout via Puppeteer as: ${pdfFileName}...`);
  const browser = await puppeteer.launch({ 
    headless: true,
    // Change 'channel' to 'browser' so it grabs the self-contained downloaded binary
    browser: 'chrome-headless-shell', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  // Puppeteer reads the HTML straight from RAM memory
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  
  // Output the dynamically named resume into the target directory
  await page.pdf({
    path: fullPdfPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
  });

  await browser.close();
  
  // Clean relative path printing for the console log
  const relativeOutputPath = path.relative(path.join(__dirname, '..'), distDir);
  console.log(`🚀 Success! Both targets saved cleanly to: ${relativeOutputPath}/`);
})();