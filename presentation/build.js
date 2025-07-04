const fs = require('fs');
const path = require('path');

function buildPage(pageName, title, contentFile) {
  try {
    const header = fs.readFileSync('components/header.html', 'utf8');
    const footer = fs.readFileSync('components/footer.html', 'utf8');
    const content = fs.readFileSync(`components/${contentFile}`, 'utf8');
    const headerWithTitle = header.replace('{{TITLE}}', title);
    const fullPage = headerWithTitle + '\n' + content + '\n' + footer;

    fs.writeFileSync(`${pageName}.html`, fullPage);

    console.log(`${pageName}.html generado exitosamente`);
  } catch (error) {
    console.error(`Error generando ${pageName}.html:`, error.message);
  }
}

buildPage('index', 'Home', 'index-content.html');
buildPage('how-it-works', 'How It Works', 'how-it-works-content.html');
buildPage('privacy', 'Privacy Policy', 'privacy.html');

console.log('🚀 Build completado!');