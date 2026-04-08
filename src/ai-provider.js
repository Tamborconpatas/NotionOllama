/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const axios = require('axios');
let OpenAI, Anthropic, GoogleGenerativeAI, BedrockRuntimeClient, InvokeModelCommand;

try { OpenAI = require('openai'); } catch (e) {}
try { Anthropic = require('@anthropic-ai/sdk'); } catch (e) {}
try { GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI; } catch (e) {}
try { 
  const aws = require('@aws-sdk/client-bedrock-runtime');
  BedrockRuntimeClient = aws.BedrockRuntimeClient;
  InvokeModelCommand = aws.InvokeModelCommand;
} catch (e) {}

require('dotenv').config();

async function generateOllama(prompt, images, model) {
  const url = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
  const payload = { model, prompt, stream: false };
  if (images && images.length > 0) payload.images = images;
  
  const response = await axios.post(url, payload);
  return response.data.response;
}

async function getOllamaModels() {
  try {
    const url = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    const baseUrl = new URL(url).origin;
    const response = await axios.get(`${baseUrl}/api/tags`);
    return response.data.models.map(m => m.name);
  } catch (error) {
    return ['qwen2.5:3b', 'moondream']; // fallback
  }
}

async function generateOpenAI(prompt, images, model, isAzure = false) {
  if (!OpenAI) throw new Error("Módulo openai no está instalado");
  let client;
  if (isAzure) {
    client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
    });
  } else {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  const messages = [{ role: 'user', content: [] }];
  
  if (images && images.length > 0) {
    messages[0].content.push({ type: 'text', text: prompt });
    images.forEach(img => {
      messages[0].content.push({
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${img}` }
      });
    });
  } else {
    messages[0].content = prompt;
  }

  const response = await client.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages,
  });
  return response.choices[0].message.content;
}

async function generateAnthropic(prompt, images, model) {
  if (!Anthropic) throw new Error("Módulo @anthropic-ai/sdk no está instalado");
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const content = [];
  
  if (images && images.length > 0) {
    images.forEach(img => {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: img }
      });
    });
    content.push({ type: 'text', text: prompt });
  } else {
    content.push({ type: 'text', text: prompt });
  }

  const response = await anthropic.messages.create({
    model: model || 'claude-3-haiku-20240307',
    max_tokens: 4096,
    messages: [{ role: 'user', content }]
  });
  return response.content[0].text;
}

async function generateGemini(prompt, images, model) {
  if (!GoogleGenerativeAI) throw new Error("Módulo @google/generative-ai no está instalado");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const aiModel = genAI.getGenerativeModel({ model: model || 'gemini-1.5-flash' });
  
  const parts = [prompt];
  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({
        inlineData: { data: img, mimeType: 'image/jpeg' }
      });
    });
  }
  
  const result = await aiModel.generateContent(parts);
  const response = await result.response;
  return response.text();
}

async function generateBedrock(prompt, images, model) {
  if (!BedrockRuntimeClient) throw new Error("Módulo @aws-sdk/client-bedrock-runtime no está instalado");
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

  const payloadId = model || 'anthropic.claude-3-haiku-20240307-v1:0';
  
  const content = [];
  if (images && images.length > 0) {
    images.forEach(img => {
      content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: img }});
    });
  }
  content.push({ type: 'text', text: prompt });

  const input = {
    modelId: payloadId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [{ role: 'user', content }]
    })
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const resultString = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(resultString);
  return parsed.content[0].text;
}

async function generateResponse(prompt, images = null, aiConfig) {
  const { provider, model } = aiConfig;
  
  try {
    switch (provider) {
      case 'ollama': return await generateOllama(prompt, images, model);
      case 'openai': return await generateOpenAI(prompt, images, model, false);
      case 'azure': return await generateOpenAI(prompt, images, model, true);
      case 'anthropic': return await generateAnthropic(prompt, images, model);
      case 'google': return await generateGemini(prompt, images, model);
      case 'aws': return await generateBedrock(prompt, images, model);
      default: throw new Error(`Proveedor desconocido: ${provider}`);
    }
  } catch (error) {
    let msg = error.message;
    if (error.response && error.response.data) {
       msg += ' - ' + JSON.stringify(error.response.data);
    }
    console.error(`\nError en el proveedor [${provider}]:`, msg);
    throw error;
  }
}

module.exports = { generateResponse, getOllamaModels };
