const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const minified = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();
fs.writeFileSync('script.js', minified);