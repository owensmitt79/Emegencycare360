const fs = require('fs');
const content = fs.readFileSync('C:/Users/user_pc/.gemini/antigravity-ide/brain/bfe006b7-63e0-4ca5-97d0-eda1b9061084/.system_generated/steps/296/content.md', 'utf8');

// Extract all strings that look like English sentences (min 4 words, no crazy characters)
const regex = /(["'`])((?:(?=(\\?))\3.)*?)\1/g;
let match;
const strings = new Set();
while ((match = regex.exec(content)) !== null) {
  const str = match[2];
  if (str.length > 20 && str.includes(' ') && !str.includes('{') && /^[a-zA-Z0-9\s.,!?'"-]+$/.test(str)) {
    strings.add(str);
  }
}

fs.writeFileSync('C:/Users/user_pc/.gemini/antigravity-ide/brain/bfe006b7-63e0-4ca5-97d0-eda1b9061084/scratch/strings.txt', Array.from(strings).join('\n'));
console.log('Extracted ' + strings.size + ' strings');
