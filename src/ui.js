/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const p = require('@clack/prompts');
const pc = require('picocolors');

async function promptUrl(history) {
  const choices = history.map(url => ({ value: url, label: url }));
  choices.push({ value: 'new', label: pc.cyan('++ 🆕 Nueva URL ++') });
  choices.push({ value: 'exit', label: pc.red('🚪 Salir') });

  const selectedUrl = await p.select({
    message: 'Selecciona la página de Notion que quieres analizar:',
    options: choices,
    maxItems: 10,
  });

  if (p.isCancel(selectedUrl)) return 'exit';

  if (selectedUrl === 'new') {
    const inputUrl = await p.text({
      message: 'Ingresa la URL de la página de Notion:',
      placeholder: 'https://www.notion.so/...',
      validate(value) {
        if (!value.includes('notion.so')) return 'Debe ser una URL válida de notion.so';
      }
    });
    if (p.isCancel(inputUrl)) return 'exit';
    return inputUrl;
  }

  return selectedUrl;
}

async function promptAction() {
  const action = await p.select({
    message: '¿Qué quieres hacer con esta página?',
    options: [
      { value: 'summarize', label: '✨ Resumir', hint: 'Análisis' },
      { value: 'elaborate', label: '📖 Elaborar conceptos', hint: 'Análisis' },
      { value: 'sentiment', label: '🎭 Analizar Tono o Sentimiento', hint: 'Análisis' },
      { value: 'key_entities', label: '🔍 Extraer Entidades Clave', hint: 'Análisis' },

      { value: 'brainstorm', label: '💡 Lluvia de ideas / Vías alternas', hint: 'Generación' },
      { value: 'outline', label: '📋 Generar Esquema jerárquico', hint: 'Generación' },
      { value: 'faq', label: '❓ Generar Preguntas Frecuentes', hint: 'Generación' },
      { value: 'continue', label: '✒️ Continuar escribiendo texto', hint: 'Generación' },
      { value: 'draft', label: '✍️ Escribir un borrador sobre...', hint: 'Generación' },

      { value: 'todo', label: '✅ Extraer Tareas explícitas', hint: 'Tareas' },
      { value: 'action_plan', label: '🚀 Diseñar un Plan de Acción', hint: 'Tareas' },

      { value: 'table', label: '📊 Crear Tabla Comparativa', hint: 'Visual' },
      { value: 'diagram', label: '📉 Generar Diagrama (Mermaid)', hint: 'Visual' },
      { value: 'flashcards', label: '🃏 Crear Flashcards de estudio', hint: 'Estudio' },

      { value: 'fix_tone', label: '🛠️ Corregir Texto y Ortografía', hint: 'Mejora' },
      { value: 'lengthen', label: '➕ Hacer más largo', hint: 'Mejora' },
      { value: 'shorten', label: '✂️ Hacer más corto', hint: 'Mejora' },
      { value: 'simplify', label: '🌱 Simplificar lenguaje', hint: 'Mejora' },
      { value: 'translate', label: '🌐 Traducir', hint: 'Mejora' },

      { value: 'search', label: '🔍 Buscar más info en Internet', hint: 'No implementado' },
      { value: 'qa', label: '💬 Hacer una pregunta específica', hint: 'Personalizado' },
      { value: 'custom_edit', label: '🪄 Edición con instrucción personalizada', hint: 'Personalizado' },
      { value: 'back', label: pc.dim('⬅️ Volver / Elegir otra URL'), hint: 'Navegación' }
    ],
    maxItems: 25,
  });

  if (p.isCancel(action)) return 'back';
  return action;
}

async function promptSubAction(action) {
  if (action === 'summarize') {
    return p.select({
      message: 'Selecciona el estilo de resumen:',
      options: [
        { value: 'un resumen ejecutivo', label: '📝 Resumen ejecutivo' },
        { value: 'una lista de puntos clave', label: '📍 Puntos clave' },
        { value: 'un TL;DR muy breve', label: '⚡ TL;DR' },
      ]
    });
  }

  if (action === 'elaborate') {
    return p.select({
      message: '¿Cúal es el nivel de la explicación?',
      options: [
        { value: 'de forma técnica', label: '🔬 Técnico / Profesional' },
        { value: 'de forma muy simple para un principiante', label: '👶 Simple y Claro' },
        { value: 'con múltiples ejemplos prácticos', label: '💡 Analógico (con ejemplos)' }
      ]
    });
  }

  if (action === 'diagram') {
    const isCustom = await p.select({
      message: '¿Sobre qué parte deberia ser el diagrama?',
      options: [
        { value: 'page_content', label: '📄 Sobre el contenido completo' },
        { value: 'custom', label: '✍️ Sobre un tema o sección que especificare...' },
      ]
    });
    if (isCustom === 'custom') {
      return p.text({
        message: 'Describe el tema para el diagrama:',
        validate: v => v.length < 3 ? 'Por favor se descriptivo' : undefined
      });
    }
    return 'page_content';
  }

  if (action === 'translate') {
    return p.select({
      message: 'Idioma destino:',
      options: ['Inglés', 'Español', 'Francés', 'Alemán', 'Portugués', 'Chino', 'Japonés', 'Italiano'].map(l => ({ value: l, label: l }))
    });
  }

  if (action === 'fix_tone') {
    return p.select({
      message: 'Tono final deseado:',
      options: ['Profesional e Impecable', 'Casual y Relajado', 'Conciso y Directo', 'Amigable y Entusiasta'].map(l => ({ value: l, label: l }))
    });
  }

  if (action === 'qa') {
    return p.text({ message: 'Escribe tu pregunta basándote en la página:', validate: v => !v ? 'Requerido' : undefined });
  }

  if (action === 'search') {
    return p.text({ message: 'Término a buscar para potenciar la página:', validate: v => !v ? 'Requerido' : undefined });
  }

  if (action === 'custom_edit') {
    return p.text({ message: '¿Qué quieres que la IA le haga a este texto?', validate: v => !v ? 'Requerido' : undefined });
  }

  if (action === 'draft') {
    return p.text({ message: '¿Sobre qué tema quieres que la IA escriba un borrador?', validate: v => !v ? 'Requerido' : undefined });
  }

  return null;
}

async function promptImage() {
  const attach = await p.confirm({
    message: '¿Deseas adjuntar una imagen física para dar más contexto a la IA?',
    initialValue: false
  });

  if (p.isCancel(attach) || !attach) return null;

  const imagePath = await p.text({
    message: 'Arrastra la imagen aquí y presiona Enter (o escribe su ruta absoluta):',
    validate: v => !v ? 'Ruta requerida' : undefined
  });

  if (p.isCancel(imagePath)) return null;
  return imagePath.replace(/^['"]|['"]$/g, '').trim();
}

async function promptReview(aiResponse) {
  const result = await p.select({
    message: '¿Qué hacer con la respuesta generada?',
    options: [
      { value: 'preview', label: '👀 Ver vista previa del resultado' },
      { value: 'save', label: '💾 APROBAR y guardar en Notion' },
      { value: 'retry', label: '🔄 Regenerar (Pedirle otra versión a la IA)' },
      { value: 'cancel', label: '❌ Cancelar' }
    ]
  });

  if (p.isCancel(result)) return 'cancel';
  return result;
}

async function promptDestination(action) {
  const options = [
    { value: 'append', label: '📥 Añadir al final de la página' },
    { value: 'replace_all', label: '🧹 Reemplazar TODO el contenido de la página' }
  ];

  if (action === 'diagram') {
    options.splice(1, 0, { value: 'replace_mermaid', label: '♻️ Reemplazar Diagrama Mermaid existente' });
  }

  const result = await p.select({
    message: '¿Dónde quieres insertar el contenido en Notion?',
    options
  });

  if (p.isCancel(result)) return 'append';
  return result;
}

async function promptProvider() {
  const provider = await p.select({
    message: '¿Qué motor de Inteligencia Artificial deseas usar en esta sesión?',
    options: [
      { value: 'ollama', label: '🦙 Ollama (Local)', hint: 'Gratis, Privado' },
      { value: 'openai', label: '🟢 OpenAI (ChatGPT)', hint: 'Requiere OPENAI_API_KEY' },
      { value: 'anthropic', label: '🟣 Anthropic (Claude)', hint: 'Requiere ANTHROPIC_API_KEY' },
      { value: 'google', label: '🔵 Google (Gemini)', hint: 'Requiere GEMINI_API_KEY' },
      { value: 'azure', label: '☁️ Azure OpenAI', hint: 'Requiere AZURE_OPENAI_API_KEY' },
      { value: 'aws', label: '🟠 AWS Bedrock', hint: 'Requiere AWS_ACCESS_KEY_ID' }
    ]
  });
  if (p.isCancel(provider)) return null;
  return provider;
}

async function promptOllamaModel(models) {
  if (!models || models.length === 0) return 'qwen2.5:3b';
  const selected = await p.select({
    message: 'Selecciona el modelo de Ollama que deseas utilizar:',
    options: models.map(m => ({ value: m, label: m })),
    maxItems: 10
  });
  if (p.isCancel(selected)) return null;
  return selected;
}

async function promptCloudModel(provider) {
  const defaults = {
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Rápido y barato)' },
      { value: 'gpt-4o', label: 'GPT-4o (Equilibrado)' },
      { value: 'o1-mini', label: 'OpenAI o1-mini (Razonamiento rápido)' },
      { value: 'o1', label: 'OpenAI o1 (Razonamiento profundo)' }
    ],
    anthropic: [
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Rápido)' },
      { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet (Recomendado)' },
      { value: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet (Nuevo)' },
      { value: 'claude-3-opus-latest', label: 'Claude 3 Opus (Análisis Completo)' }
    ],
    google: [
      { value: 'gemini-pro-latest', label: 'Gemini 3.1 Pro (Mayor razonamiento e inteligencia)' },
      { value: 'gemini-flash-latest', label: 'Gemini 3.0 Flash (Extremadamente Rápido)' },
      { value: 'gemini-flash-lite-latest', label: 'Gemini 3.1 Flash Lite (Extremadamente Rápido)' },
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Clásico y rápido)' },
      { value: 'gemma-4-26b-a4b-it', label: 'Gemma 4 26B (Ligero / Local-ish)' },
      { value: 'gemma-4-31b-it', label: 'Gemma 4 31B (Rendimiento equilibrado)' }
    ],
    azure: [
      { value: 'gpt-4o-mini', label: 'Modelo configurado en el Deployment de Azure' },
      { value: 'gpt-4o', label: 'GPT-4o (Equilibrado)' },
      { value: 'o3-mini', label: 'OpenAI o3-mini (Razonamiento rápido)' },
      { value: 'o3', label: 'OpenAI o3 (Razonamiento profundo)' }
    ],
    aws: [
      { value: 'anthropic.claude-3-haiku-20240307-v1:0', label: 'Claude 3 Haiku (AWS Bedrock)' },
      { value: 'anthropic.claude-3-5-sonnet-20240620-v1:0', label: 'Claude 3.5 Sonnet (AWS Bedrock)' },
      { value: 'anthropic.claude-3-7-sonnet-20240620-v1:0', label: 'Claude 3.7 Sonnet (AWS Bedrock)' },
      { value: 'anthropic.claude-3-opus-20240620-v1:0', label: 'Claude 3 Opus (AWS Bedrock)' }
    ]
  };

  const options = defaults[provider];
  if (!options) return null;

  const selected = await p.select({
    message: 'Elige el modelo específico de la nube:',
    options
  });

  if (p.isCancel(selected)) return null;
  return selected;
}

module.exports = { promptUrl, promptAction, promptSubAction, promptReview, promptDestination, promptImage, promptProvider, promptOllamaModel, promptCloudModel };
