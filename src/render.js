const fs = require('fs');
const puppeteer = require('puppeteer');
const generateTemplate = require('./template.js'); // Import template function

(async () => {
  console.log('📄 Parsing resume.json...');
  const resume = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));

  // Compile the layout string using the modular template module
  const htmlContent = generateTemplate(resume);

  fs.writeFileSync('./index.html', htmlContent);
  console.log('✅ index.html generated.');

  console.log('🚀 Rendering PDF layout via Puppeteer...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  
  await page.pdf({
    path: './resume.pdf',
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
  });

  await browser.close();
  console.log('🚀 Success! resume.pdf compiled flawlessly from your modular setup.');
})();