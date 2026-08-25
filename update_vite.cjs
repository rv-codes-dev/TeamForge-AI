const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf-8');
content = content.replace('build: {', 'build: {\n    chunkSizeWarningLimit: 1500,');
fs.writeFileSync('vite.config.ts', content);
