/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

async function generateResponse(prompt, images = null) {
  try {
    const requestModel = (images && images.length > 0) ? 'moondream' : OLLAMA_MODEL;

    const payload = {
      model: requestModel,
      prompt: prompt,
      stream: false
    };

    if (images && images.length > 0) {
      payload.images = images;
    }

    const response = await axios.post(OLLAMA_URL, payload);
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error.message);
    throw error;
  }
}

module.exports = { generateResponse };
