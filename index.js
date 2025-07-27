const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const googleTTS = require('google-tts-api');

const inputFile = 'vocab.tsv';
const outputDir = 'anki_audio';
const outputTSV = 'anki_import.tsv';
const language = 'pt-BR'; // Brazilian Portuguese

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const lines = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

// Prepare TSV output
const ankiLines = [];

async function processLine(line) {
  const [ptWord, enWord] = line.split('\t');
  if (!ptWord || !enWord) {
    console.warn(`⚠️ Skipping invalid line: "${line}"`);
    return;
  }

  try {
    const url = googleTTS.getAudioUrl(ptWord, {
      lang: language,
      slow: false,
      host: 'https://translate.google.com',
    });

    const audioRes = await fetch(url);
    const buffer = await audioRes.buffer();

    const filename = `${ptWord}.mp3`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, buffer);

    // Format: Front tab Back
    const front = enWord;
    const back = `${ptWord} [sound:${filename}]`;

    ankiLines.push(`${front}\t${back}`);
    console.log(`✅ Processed: ${ptWord}`);
  } catch (err) {
    console.error(`❌ Failed for "${ptWord}": ${err.message}`);
  }
}

(async () => {
  for (const line of lines) {
    await processLine(line);
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(outputTSV, ankiLines.join('\n'), 'utf8');
  console.log(`\n📄 Done. Import into Anki using: ${outputTSV}`);
})();
