const fs = require('fs');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node add-audio-column.js <input-file.tsv> <output-file.tsv>');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

if (!fs.existsSync(inputFile)) {
  console.error(`Input file "${inputFile}" not found!`);
  process.exit(1);
}

const data = fs.readFileSync(inputFile, 'utf-8').trim().split('\n');
const header = data.shift().split('\t');

const targetIndex = header.indexOf('Target');
if (targetIndex === -1) {
  console.error('No "Target" column found!');
  process.exit(1);
}

const audioColName = 'Audio';
header.push(audioColName);

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúãõçàèìòùâêîôûäëïöüñ_-]/gi, '_');
}

const rows = data.map(line => {
  const cols = line.split('\t');
  const target = cols[targetIndex].trim();
  const sanitized = sanitizeFilename(target);
  cols.push(`[sound:${sanitized}.mp3]`);
  return cols.join('\t');
});

const outputData = [header.join('\t'), ...rows].join('\n');
fs.writeFileSync(outputFile, outputData);

console.log(`✅ Audio column added and written to "${outputFile}"`);
