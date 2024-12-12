require('dotenv').config();

const { execSync } = require('child_process');

const port = process.env.NEXT_PUBLIC_PORT || 4242;
execSync(`cross-env PORT=${port} next start`, { stdio: 'inherit' });