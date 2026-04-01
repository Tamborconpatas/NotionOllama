/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const { Client } = require('@notionhq/client');
require('dotenv').config();
const { markdownToNotionBlocks } = require('./src/markdown-parser');

const notion = new Client({ auth: process.env.NOTION_KEY });

function splitText(text, limit = 2000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += limit) {
    chunks.push(text.substring(i, i + limit));
  }
  return chunks;
}

function toRichTextArray(text, annotations = {}) {
  return splitText(text).map(chunk => ({
    type: 'text',
    text: { content: chunk },
    annotations: annotations
  }));
}

function extractPageId(url) {
  const match = url.match(/([a-f0-9]{32})/);
  return match ? match[0] : url;
}

async function getPageTextContent(pageId) {
  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    const content = blocks.results
      .map(block => {
        const type = block.type;
        const richText = block[type]?.rich_text;
        if (richText && Array.isArray(richText)) {
          return richText.map(t => t.plain_text).join('');
        }
        return '';
      })
      .filter(text => text.length > 0)
      .join('\n');

    return content;
  } catch (error) {
    console.error('Error fetching Notion page content:', error.message);
    throw error;
  }
}

async function appendParagraph(pageId, text) {
  try {
    const chunks = splitText(text, 2000);
    const children = chunks.map(chunk => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: chunk }, annotations: { italic: true, color: 'gray' } }]
      }
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: children
    });
  } catch (error) {
    console.error('Error appending block to Notion:', error.message);
    throw error;
  }
}

async function createTable(pageId, tableData) {
  try {
    const tableRows = tableData.map(row => ({
      type: 'table_row',
      table_row: {
        cells: row.map(cell => ([{ type: 'text', text: { content: String(cell).substring(0, 2000) } }]))
      }
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: tableData[0].length,
            has_column_header: true,
            has_row_header: false,
            children: tableRows
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error creating table in Notion:', error.message);
    throw error;
  }
}

async function appendDiagram(pageId, mermaidCode) {
  try {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: toRichTextArray(mermaidCode),
            language: 'mermaid'
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error appending diagram to Notion:', error.message);
    throw error;
  }
}

async function appendToDo(pageId, tasks) {
  try {
    const toDoBlocks = tasks.map(task => ({
      object: 'block',
      type: 'to_do',
      to_do: {
        rich_text: toRichTextArray(task.substring(0, 2000)),
        checked: false
      }
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: toDoBlocks.slice(0, 100)
    });
  } catch (error) {
    console.error('Error creating To-Do list in Notion:', error.message);
    throw error;
  }
}

async function appendBulletedList(pageId, items) {
  try {
    const listBlocks = items.map(item => ({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: toRichTextArray(item.substring(0, 2000))
      }
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: listBlocks.slice(0, 100)
    });
  } catch (error) {
    console.error('Error creating bulleted list in Notion:', error.message);
    throw error;
  }
}

async function appendCallout(pageId, text, emoji = '💡') {
  try {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: toRichTextArray(text),
            icon: { emoji: emoji }
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error creating callout in Notion:', error.message);
    throw error;
  }
}

async function appendMarkdownToPage(pageId, markdownText) {
  try {
    const blocks = markdownToNotionBlocks(markdownText);

    for (let i = 0; i < blocks.length; i += 100) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: blocks.slice(i, i + 100)
      });
    }
  } catch (error) {
    console.error('Error appending markdown to Notion:', error.message);
    throw error;
  }
}

async function clearPageContent(pageId) {
  try {
    let hasMore = true;
    let nextCursor = undefined;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: nextCursor,
        page_size: 100
      });

      for (const block of response.results) {
        await notion.blocks.delete({ block_id: block.id });
      }

      hasMore = response.has_more;
      nextCursor = response.next_cursor;
    }
  } catch (error) {
    console.error('Error clearing page content:', error.message);
    throw error;
  }
}

async function replaceMermaidBlock(pageId, markdownText) {
  try {
    let hasMore = true;
    let nextCursor = undefined;
    let targetBlockId = null;

    while (hasMore && !targetBlockId) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: nextCursor,
        page_size: 100
      });

      for (const block of response.results) {
        if (block.type === 'code' && block.code.language === 'mermaid') {
          targetBlockId = block.id;
          break;
        }
      }

      hasMore = response.has_more;
      nextCursor = response.next_cursor;
    }

    if (targetBlockId) {
      const cleanMermaid = markdownText.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
      await notion.blocks.update({
        block_id: targetBlockId,
        code: {
          rich_text: toRichTextArray(cleanMermaid),
          language: 'mermaid'
        }
      });
      return true;
    } else {
      await appendMarkdownToPage(pageId, markdownText);
      return false;
    }
  } catch (error) {
    console.error('Error replacing mermaid block:', error.message);
    throw error;
  }
}

module.exports = {
  getPageTextContent,
  appendParagraph,
  extractPageId,
  createTable,
  appendDiagram,
  appendToDo,
  appendBulletedList,
  appendCallout,
  appendMarkdownToPage,
  clearPageContent,
  replaceMermaidBlock
};
