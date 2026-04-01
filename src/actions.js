/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const { generateResponse } = require('../ollama-client');
const { performSearch } = require('../search-client');

async function getActionPrompt(action, subChoice, context) {
  switch (action) {
    case 'summarize':
      return `Genera ${subChoice} del siguiente contenido:\n\n${context}`;

    case 'elaborate':
      return `Explica ${subChoice} este contenido detalladamente usando buen Markdown:\n\n${context}`;

    case 'diagram':
      const diagramTopic = subChoice === 'page_content' ? context : subChoice;
      return `Genera un diagrama Mermaid.js (graph TD o sequenceDiagram) sobre: ${diagramTopic}. Devuelve SOLO el código mermaid encapsulado en bloques \`\`\`mermaid\`, sin otra explicación extra.`;

    case 'todo':
      return `Extrae las tareas pendientes de este texto como un array JSON estricto de strings. Ejemplo: ["Tarea 1", "Tarea 2"]. No escribas NADA que no sea el bloque JSON.\n\nContenido:\n${context}`;

    case 'table':
      return `Genera una tabla comparativa del contenido en formato array JSON estricto de arrays. Ejemplo: [["Cabecera 1", "Cabecera 2"], ["Fila 1 A", "Fila 1 B"]]. No escribas NADA que no sea el bloque JSON.\n\nContenido:\n${context}`;

    case 'translate':
      return `Traduce de manera profesional al ${subChoice} el siguiente contenido. Mantén estructuras Markdown:\n\n${context}`;

    case 'lengthen':
      return `Expande este texto para hacerlo más largo y detallado, manteniendo el estilo original:\n\n${context}`;

    case 'shorten':
      return `Acorta el siguiente texto de forma concisa eliminando la redundancia:\n\n${context}`;

    case 'simplify':
      return `Reescribe este texto usando palabras muy sencillas, claras y fáciles de entender:\n\n${context}`;

    case 'custom_edit':
      return `Modifica el siguiente texto cumpliendo estrictamente con las siguientes instrucciones dadas: "${subChoice}"\n\nTexto Original:\n${context}`;

    case 'draft':
      return `Escribe un borrador profesional e informativo detallado sobre el siguiente tema: "${subChoice}". Trata de relacionarlo si puedes con el contexto (opcional):\n\nContexto Original:\n${context}`;

    case 'fix_tone':
      return `Corrige la ortografía y ajusta el tono para que suene "${subChoice}":\n\n${context}`;

    case 'qa':
      return `Responde de manera precisa basándote en el contenido:\n\n**Contenido Original**:\n${context}\n\n**Pregunta del Usuario**: ${subChoice}`;

    case 'search':
      const results = await performSearch(subChoice);
      return `Redacta un informe basado en estos resultados de búsqueda sobre "${subChoice}" e intégralos suavemente si tienen relación. Resultados:\n\n${results}\n\nContexto Original:\n${context}`;

    case 'continue':
      return `Continúa escribiendo de forma natural a partir del siguiente contenido:\n\n${context}`;

    case 'brainstorm':
      return `Basándote en el siguiente contenido, genera una exhaustiva Lluvia de Ideas (Brainstorming) con nuevas perspectivas, ideas relacionadas o próximos pasos creativos usando viñetas Markdown:\n\n${context}`;

    case 'outline':
      return `Genera un Esquema (Outline) de alto nivel, estructurado y jerárquico del siguiente contenido. Usa listas anidadas de Markdown:\n\n${context}`;

    case 'flashcards':
      return `Crea una lista de Flashcards (formato Pregunta/Respuesta clara) perfectas para estudiar este material usando Markdown:\n\n${context}`;

    case 'key_entities':
      return `Extrae rigurosamente las Entidades Clave (personas, lugares, fechas, conceptos vitales) y listalas usando viñetas con su leve descripción en Markdown:\n\n${context}`;

    case 'faq':
      return `Genera una lista de Preguntas Frecuentes (FAQ) realistas con sus respuestas basadas únicamente en este contenido:\n\n${context}`;

    case 'action_plan':
      return `Crea un detallado Plan de Acción paso a paso basado en las metas o problemas implícitos/mencionados en este texto:\n\n${context}`;

    case 'sentiment':
      return `Analiza el tono y el sentimiento general de este texto, detallando los puntos de vista o posibles sesgos, y proporciona una breve explicación:\n\n${context}`;
  }
  return '';
}

async function runAction(action, subPromptData, context, images = []) {
  const finalPrompt = await getActionPrompt(action, subPromptData, context);
  if (!finalPrompt) throw new Error('Action prompt empty.');

  let response = await generateResponse(finalPrompt, null, images);
  if (action === 'diagram') {
    const cleanMermaid = response.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    response = `\`\`\`mermaid\n${cleanMermaid}\n\`\`\``;
  }

  return response;
}

module.exports = { runAction };
