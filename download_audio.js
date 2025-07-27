const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ====== Config ======
const OUTPUT_DIR = 'audio';

// ====== Parse Arguments ======
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node download-audio.js <input-file.tsv>');
  process.exit(1);
}
const inputFile = args[0];

if (!fs.existsSync(inputFile)) {
  console.error(`Input file "${inputFile}" not found!`);
  process.exit(1);
}

// ====== Helpers ======

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúãõçàèìòùâêîôûäëïöüñ_-]/gi, '_');
}

function generateTTSUrl(text) {
  const baseUrl = 'https://translate.google.com/translate_tts';
  const params = new URLSearchParams({
    ie: 'UTF-8',
    q: text,
    tl: 'pt-BR',
    client: 'tw-ob'
  });
  return `${baseUrl}?${params.toString()}`;
}

async function downloadTTS(text, filepath) {
  try {
    const url = generateTTSUrl(text);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/104.0.0.0 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to download "${text}": ${err.message}`);
  }
}

// ====== Main ======

(async () => {
  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const rawData = fs.readFileSync(inputFile, 'utf-8').trim().split('\n');
  const header = rawData.shift().split('\t');
  const targetIndex = header.indexOf('Target');

  if (targetIndex === -1) {
    console.error('❌ No "Target" column found in input file!');
    process.exit(1);
  }

  for (const line of rawData) {
    const cols = line.split('\t');
    const target = cols[targetIndex].trim();
    if (!target) continue;

    const filename = sanitizeFilename(target) + '.mp3';
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`✅ ${filename} already exists, skipping.`);
      continue;
    }

    console.log(`🔊 Downloading: "${target}"...`);
    await downloadTTS(target, filepath);
    console.log(`✔️ Saved to: ${filepath}`);
  }

  console.log('\n🎉 Done downloading all audio files!');
})();
