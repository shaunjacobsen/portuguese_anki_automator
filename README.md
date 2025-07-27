# TSV to Anki Verb Flashcard Suite

This project contains a set of Node.js scripts to help convert a simple TSV file of Portuguese (PT), English (EN), and French (FR) verbs into an Anki-ready TSV file with example sentences, conjugations, and audio links.

## Overview

You start with a TSV file containing **3 columns only**:  
`Portuguese` | `English` | `French`

The goal is to generate, for each verb:  
- Example sentences for each language  
- Conjugations of the verb for these forms:  
  - eu (I), você/ele/ela/a gente (you/he/she/we informal), nós (we), vocês/eles/elas (you plural/they)  
  - Present tense  
  - Present progressive  
  - Simple past tense  

The example sentences and conjugations can be generated using ChatGPT with the following prompt:

```
Generate example sentences and verb conjugations for the following verbs in Portuguese, English, and French.
For each verb, provide:

    Present tense conjugation for: eu, você/ele/ela/a gente, nós, vocês/eles/elas

    Present progressive forms for the same persons

    Simple past tense forms for the same persons

    One example sentence per language using the verb in a natural context

The output headers should be:
Target\tEnglish\tFrench\tGrammatical type\tPortuguese sentence\tEnglish sentence\tFrench sentence\teu (presente)\tvocê / ele / ela / a gente (presente)\tnós (presente)\tvocês / eles / elas (presente)

Generate the output as plain-text tab-separated values so it can be copy and pasted into a file.

```

---

## Scripts

### 1. `download_audio.js`

Downloads audio pronunciations for each word in the TSV file.

**Usage:**  
`node download_audio.js <input-file.tsv>`

Input: TSV file with columns for PT, EN, and FR verbs.

Output: Audio files downloaded and saved locally (usually in a specified folder).

### 2. add_audio_to_tsv.js

Adds audio file references to the TSV entries so that Anki can use the audio.

**Usage:**
`node add_audio_to_tsv.js <input-file.tsv> <output-file.tsv>`

Input: Original TSV file

Output: New TSV file with added columns linking to audio files for Anki import.

## How to Use

Prepare your initial TSV file with columns:
Portuguese \t English \t French

Use ChatGPT (or another method) with the prompt above to generate the verb conjugations and example sentences. Append these conjugations and sentences to your TSV or create a new file including them.

Run the audio downloader:

`node download_audio.js verbs_with_conjugations.tsv`

Run the audio adder script to produce the final TSV for Anki:

`node add_audio_to_tsv.js verbs_with_conjugations.tsv verbs_for_anki.tsv`

Import the final TSV (verbs_for_anki.tsv) into Anki.

Ensure the audio files downloaded in step 3 are placed in the folder Anki uses for media (usually the Anki media collection folder on desktop). This allows the audio to play correctly in the flashcards.

## Notes

- This setup assumes Node.js is installed. Run `npm i` first!
- The audio downloader uses online resources to fetch pronunciation files.
- Make sure your TSV columns remain consistent to avoid import errors.
- You can customize or extend the scripts to include other tenses or languages.

