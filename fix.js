const fs = require('fs');
let c = fs.readFileSync('src/data/vnptDocumentation.ts', 'utf8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('src/data/vnptDocumentation.ts', c, 'utf8');
console.log('Fixed backticks!');
