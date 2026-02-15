import { writeFileSync } from 'fs';
writeFileSync('dist/index.cjs', 'import("./index.js");\n');
