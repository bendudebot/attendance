const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, '..', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const pages = [
  // Web pages (1200x800)
  { name: 'web-dashboard', file: 'web-dashboard.html', width: 1200, height: 800 },
  { name: 'web-attendance', file: 'web-attendance.html', width: 1200, height: 800 },
  { name: 'web-students', file: 'web-students.html', width: 1200, height: 800 },
  { name: 'web-reports', file: 'web-reports.html', width: 1200, height: 800 },
  // Mobile pages (430x932)
  { name: 'mobile-home', file: 'mobile-home.html', width: 430, height: 932 },
  { name: 'mobile-list', file: 'mobile-list.html', width: 430, height: 932 },
  { name: 'mobile-history', file: 'mobile-history.html', width: 430, height: 932 },
];

async function generateScreenshots() {
  console.log('🚀 Starting screenshot generation...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const page of pages) {
    const pageInstance = await browser.newPage();
    
    await pageInstance.setViewport({
      width: page.width,
      height: page.height,
      deviceScaleFactor: 2, // Retina quality
    });

    const filePath = `file://${path.join(__dirname, page.file)}`;
    await pageInstance.goto(filePath, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    const outputPath = path.join(screenshotsDir, `${page.name}.png`);
    await pageInstance.screenshot({
      path: outputPath,
      type: 'png',
    });

    console.log(`✅ Generated: ${page.name}.png (${page.width}x${page.height})`);
    await pageInstance.close();
  }

  await browser.close();
  console.log('\n🎉 All screenshots generated successfully!');
  console.log(`📁 Output directory: ${screenshotsDir}`);
}

generateScreenshots().catch(console.error);
