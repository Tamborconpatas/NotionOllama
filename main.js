/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const p = require('@clack/prompts');
const pc = require('picocolors');
const ora = require('ora');

const { promptUrl, promptAction, promptSubAction, promptReview, promptDestination, promptImage } = require('./src/ui');
const { runAction } = require('./src/actions');
const {
  getPageTextContent,
  extractPageId,
  createTable,
  appendDiagram,
  appendToDo,
  appendCallout,
  appendMarkdownToPage,
  clearPageContent,
  replaceMermaidBlock
} = require('./notion-client');

const HISTORY_FILE = path.join(__dirname, '.notion_history.json');

function saveToHistory(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return;
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
      history = [];
    }
  }
  if (!history.includes(url)) {
    history.unshift(url);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 5)));
  }
}

function getHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')).filter(u => u && u.includes('notion.so'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

async function main() {
  console.clear();
  p.intro(pc.bgCyan(pc.black(' NotionAI local con Ollama 🚀 ')));

  while (true) {
    try {
      const history = getHistory();
      const notionUrl = await promptUrl(history);
      if (notionUrl === 'exit') break;

      saveToHistory(notionUrl);

      const pageId = extractPageId(notionUrl);
      if (!pageId || pageId.length < 32) {
        p.log.error('❌ ID de página inválido.');
        continue;
      }

      while (true) {
        const action = await promptAction();
        if (action === 'back') break;

        let subChoice = await promptSubAction(action);
        if (subChoice === null && p.isCancel(subChoice)) break;

        let images = [];
        const imagePath = await promptImage();
        if (imagePath) {
          if (fs.existsSync(imagePath)) {
            try {
              const base64Data = fs.readFileSync(imagePath).toString('base64');
              images.push(base64Data);
              p.log.success('📸 Imagen cargada correctamente (usando moondream).');
            } catch (err) {
              p.log.warn('No se pudo leer la imagen: ' + err.message);
            }
          } else {
            p.log.warn('La ruta de la imagen no existe. Se ignorará.');
          }
        }

        const spinner = ora('Leyendo contenido de Notion...').start();
        let context = '';
        try {
          context = await getPageTextContent(pageId);
          spinner.succeed('Página leída correctamente.');
        } catch (e) {
          spinner.fail('Error leyendo página.');
          p.log.error(e.message);
          continue;
        }

        let isApproved = false;
        let aiResponse = '';

        while (!isApproved) {
          spinner.start('🤖 La IA está pensando (esto puede tardar unos segundos)...');
          try {
            aiResponse = await runAction(action, subChoice, context, images);
            spinner.succeed('IA ha respondido.');
          } catch (e) {
            spinner.fail('Error al consultar Ollama local.');
            p.log.error(e.message);
            break;
          }

          const reviewAction = await promptReview(aiResponse);

          if (reviewAction === 'cancel') {
            break;
          }
          else if (reviewAction === 'preview') {
            p.log.info(pc.cyan('\n=== VISTA PREVIA ===\n') + aiResponse + pc.cyan('\n====================\n'));
          }
          else if (reviewAction === 'retry') {
            p.log.info(pc.yellow('Recalculando...'));
          }
          else if (reviewAction === 'save') {
            isApproved = true;
          }
        }

        if (!isApproved) {
          p.log.message('Acción cancelada. No se guardó nada en Notion.');
          continue;
        }

        const dest = await promptDestination(action);

        spinner.start(`Sincronizando con Notion (${dest})...`);
        try {
          if (dest === 'replace_all') {
            await clearPageContent(pageId);
          }

          if (dest === 'replace_mermaid') {
            const wasReplaced = await replaceMermaidBlock(pageId, aiResponse);
            if (!wasReplaced) {
              p.log.warn('No se encontró ningún diagrama previo para reemplazar. Se añadió al final.');
            }
          } else if (action === 'diagram') {
            await appendDiagram(pageId, aiResponse.replace(/```mermaid|```/g, '').trim());
          } else if (action === 'todo' || action === 'table') {
            try {
              const match = aiResponse.match(/\[.*\]/s);
              if (match) {
                const data = JSON.parse(match[0]);
                if (action === 'todo') await appendToDo(pageId, data);
                else await createTable(pageId, data);
              } else {
                throw new Error('Formato JSON no encontrado');
              }
            } catch (e) {
              p.log.warn('No se pudo parsear el JSON estricto. Guardando como Markdown estándar.');
              await appendMarkdownToPage(pageId, aiResponse);
            }
          } else {
            if (action === 'translate') await appendCallout(pageId, `Traducción (${subChoice})`, '🌐');
            await appendMarkdownToPage(pageId, aiResponse);
          }
          spinner.succeed('¡Contenido sincronizado exitosamente en Notion!');
        } catch (e) {
          spinner.fail('Error guardando en Notion.');
          p.log.error(e.message);
        }

        const loop = await p.confirm({
          message: '¿Quieres hacer algo MÁS con esta misma página?',
          initialValue: true
        });

        if (p.isCancel(loop) || !loop) {
          break;
        }
      }

    } catch (err) {
      if (err.name === 'CancelPromptError') break;
      p.log.error('Error crítico: ' + err.message);
    }
  }

  p.outro(pc.green('¡Hasta luego!'));
}

main();
