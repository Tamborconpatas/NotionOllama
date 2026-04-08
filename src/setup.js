/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const fs = require('fs');
const path = require('path');
const p = require('@clack/prompts');
const pc = require('picocolors');

const ENV_PATH = path.join(__dirname, '..', '.env');

async function runSetupIfNeeded() {
  if (fs.existsSync(ENV_PATH)) {
    return; 
  }

  console.clear();
  p.intro(pc.bgBlue(pc.white(' Bienvenido al Asistente de Configuración de NotionOllama 🚀 ')));
  p.note('Parece que es tu primera vez iniciando la aplicación. Vamos a configurar tus claves de acceso.');

  const envData = [];
  const notionKey = await p.text({
    message: '1. Pega tu NOTION_API_KEY (Requerido)',
    placeholder: 'secret_abc123...',
    validate(val) {
      if (!val || val.trim() === '') return 'La clave de Notion es obligatoria para continuar.';
    }
  });
  if (p.isCancel(notionKey)) process.exit(0);
  envData.push(`NOTION_API_KEY=${notionKey.trim()}`);
  envData.push(`OLLAMA_URL=http://localhost:11434/api/generate`);

  const configureCloud = await p.confirm({
    message: '¿Deseas configurar las APIs de la nube ahora? (Ej: OpenAI, Anthropic, Google. Puedes saltarlo)',
    initialValue: true
  });

  if (!p.isCancel(configureCloud) && configureCloud) {
    p.note('Puedes dejarlos en blanco y presionar Enter si no tienes la clave de alguno en particular.');

    p.log.message(pc.dim('🔗 Consigue tu clave OpenAI en: https://platform.openai.com/api-keys'));
    const openai = await p.text({ message: 'OPENAI_API_KEY:', placeholder: 'sk-...' });
    if (!p.isCancel(openai) && openai.trim() !== '') envData.push(`OPENAI_API_KEY=${openai.trim()}`);
    p.log.message(pc.dim('🔗 Consigue tu clave Anthropic en: https://console.anthropic.com/settings/keys'));
    const anthropic = await p.text({ message: 'ANTHROPIC_API_KEY:', placeholder: 'sk-ant-...' });
    if (!p.isCancel(anthropic) && anthropic.trim() !== '') envData.push(`ANTHROPIC_API_KEY=${anthropic.trim()}`);
    p.log.message(pc.dim('🔗 Consigue tu clave Google Gemini en: https://aistudio.google.com/app/apikey'));
    const gemini = await p.text({ message: 'GEMINI_API_KEY:', placeholder: 'AIza...' });
    if (!p.isCancel(gemini) && gemini.trim() !== '') envData.push(`GEMINI_API_KEY=${gemini.trim()}`);
    p.log.message(pc.dim('🔗 Consigue Azure OpenAI en el Portal de Azure'));
    const azureKey = await p.text({ message: 'AZURE_OPENAI_API_KEY:' });
    if (!p.isCancel(azureKey) && azureKey.trim() !== '') {
      envData.push(`AZURE_OPENAI_API_KEY=${azureKey.trim()}`);
      const azureEnd = await p.text({ message: 'AZURE_OPENAI_ENDPOINT:', placeholder: 'https://tu-recurso.openai.azure.com/' });
      envData.push(`AZURE_OPENAI_ENDPOINT=${azureEnd.trim()}`);
      const azureDep = await p.text({ message: 'AZURE_OPENAI_DEPLOYMENT:' });
      envData.push(`AZURE_OPENAI_DEPLOYMENT=${azureDep.trim()}`);
    }

    p.log.message(pc.dim('🔗 Consigue AWS Bedrock en la consola AWS IAM'));
    const awsKey = await p.text({ message: 'AWS_ACCESS_KEY_ID:' });
    if (!p.isCancel(awsKey) && awsKey.trim() !== '') {
      envData.push(`AWS_ACCESS_KEY_ID=${awsKey.trim()}`);
      const awsSecret = await p.text({ message: 'AWS_SECRET_ACCESS_KEY:' });
      envData.push(`AWS_SECRET_ACCESS_KEY=${awsSecret.trim()}`);
      const awsRegion = await p.text({ message: 'AWS_REGION:', initialValue: 'us-east-1' });
      envData.push(`AWS_REGION=${awsRegion.trim()}`);
    }
  }

  fs.writeFileSync(ENV_PATH, envData.join('\n'));
  p.outro(pc.green('¡Configuración guardada en .env! Cargando la aplicación...'));
  require('dotenv').config({ path: ENV_PATH, override: true });
}

module.exports = { runSetupIfNeeded };
