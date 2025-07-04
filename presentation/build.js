const fs = require('fs');
const path = require('path');

// Función para construir las páginas
function buildPage(pageName, title, contentFile) {
  try {
    // Leer los archivos
    const header = fs.readFileSync('components/header.html', 'utf8');
    const footer = fs.readFileSync('components/footer.html', 'utf8');
    const content = fs.readFileSync(`components/${contentFile}`, 'utf8');
    
    // Reemplazar el placeholder del título
    const headerWithTitle = header.replace('{{TITLE}}', title);
    
    // Combinar todo
    const fullPage = headerWithTitle + '\n' + content + '\n' + footer;
    
    // Escribir el archivo final
    fs.writeFileSync(`${pageName}.html`, fullPage);
    
    console.log(`✅ ${pageName}.html generado exitosamente`);
  } catch (error) {
    console.error(`❌ Error generando ${pageName}.html:`, error.message);
  }
}

// Generar las páginas
buildPage('index', 'Home', 'index-content.html');
buildPage('how-it-works', 'How It Works', 'how-it-works-content.html');

console.log('🚀 Build completado!');