const fs = require('fs');

const htmlPath = 'index.html';
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    fs.writeFileSync('src/style.css', styleMatch[1].trim());
    console.log('Wrote src/style.css');
} else {
    console.log('No <style> found');
}

// Extract JS
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    let scriptContent = scriptMatch[1].trim();
    
    // Make functions global so inline onclick still works with type="module"
    const globalExports = `
// Expose functions to global scope for HTML onclick attributes
window.verifyAuth = verifyAuth;
window.skipAuth = skipAuth;
window.saveEdits = saveEdits;
window.addTimelineItem = addTimelineItem;
window.addGalleryItem = addGalleryItem;
window.addBucketItem = addBucketItem;
`;
    fs.writeFileSync('src/main.js', scriptContent + '\n' + globalExports);
    console.log('Wrote src/main.js');
} else {
    console.log('No <script> found');
}

// Replace in HTML
let newHtml = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/src/style.css" />');
newHtml = newHtml.replace(/<script>[\s\S]*?<\/script>/, '<script type="module" src="/src/main.js"></script>');

fs.writeFileSync(htmlPath, newHtml);
console.log('Updated index.html');
