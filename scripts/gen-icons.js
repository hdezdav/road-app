// One-shot script to write the App Router favicons.
// We do this via a script (instead of `node -e`) because PowerShell mangles
// the parentheses in `url(#g)` when passed as an inline argument.
const fs = require('fs');
const path = require('path');

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/>' +
  '</linearGradient></defs>' +
  '<rect width="64" height="64" rx="14" fill="url(#g)"/>' +
  '<path fill="#ffffff" d="M20 16h14a10 10 0 0 1 4.5 18.9L46 48h-9l-6-12h-3v12h-8V16Zm8 7v8h6a4 4 0 0 0 0-8h-6Z"/>' +
  '</svg>\n';

const apple =
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/>' +
  '</linearGradient></defs>' +
  '<rect width="180" height="180" rx="38" fill="url(#g)"/>' +
  '<path fill="#ffffff" d="M56 44h40a28 28 0 0 1 12.7 53.1L130 136h-26l-17-34h-9v34H56V44Zm22 20v22h17a11 11 0 0 0 0-22H78Z"/>' +
  '</svg>\n';

const appDir = path.join(__dirname, '..', 'apps', 'web', 'src', 'app');
fs.writeFileSync(path.join(appDir, 'icon.svg'), icon);
fs.writeFileSync(path.join(appDir, 'apple-icon.svg'), apple);
console.log('icons written to', appDir);
