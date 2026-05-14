const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const generateTemplate = require('./template.js');

(async () => {
  // Capture command-line arguments (e.g., node src/render.js data_science.json)
  // process.argv[0] is node, process.argv[1] is the script path, process.argv[2] is your argument
  const jsonFilename = process.argv[2] || 'resume.json';
  
  // Resolve the absolute path to the data file inside the data/ folder
  const jsonPath = path.join(__dirname, '../data', jsonFilename);

  // Robust error handling if the specified file doesn't exist
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: File not found at ${jsonPath}`);
    console.error(`💡 Make sure the file exists inside your 'data/' directory.`);
    process.exit(1);
  }

  console.log(`📄 Parsing data/${jsonFilename}...`);
  const resume = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Generate the raw HTML string completely in-memory
  const htmlContent = generateTemplate(resume);

  // Define the target distribution folder path for just the PDF
  const distDir = path.join(__dirname, '../dist');

  // Automatically create the dist/ folder if it doesn't exist yet
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist/ directory.');
  }

  // Dynamically extract name from JSON and format it (e.g., "Dominick Robinson" -> "DOMINICK_ROBINSON_RESUME.pdf")
  const formattedName = resume.basics.name.toUpperCase().replace(/\s+/g, '_');
  const pdfFileName = `${formattedName}_RESUME.pdf`;
  const fullPdfPath = path.join(distDir, pdfFileName);

  console.log(`🚀 Rendering PDF layout via Puppeteer as: ${pdfFileName}...`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Puppeteer reads the HTML straight from RAM memory
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  
  // Output the dynamically named resume into the dist/ directory
  await page.pdf({
    path: fullPdfPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
  });

  await browser.close();
  console.log(`🚀 Success! ${pdfFileName} saved cleanly to dist/ folder.`);
})();