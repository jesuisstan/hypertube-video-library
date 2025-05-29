// CommonJS module:
require('dotenv').config();

const { execSync } = require('child_process');

const port = process.env.NEXT_PUBLIC_PORT || 2121;
console.log(`Starting development server on port ${port}...`);
execSync(`cross-env PORT=${port} next dev`, { stdio: 'inherit' });
