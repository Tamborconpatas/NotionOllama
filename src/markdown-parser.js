/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const { lexer } = require('marked');

function splitText(text, limit = 2000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += limit) {
    chunks.push(text.substring(i, i + limit));
  }
  return chunks;
}

function parseInlineFormatting(text) {
  return [{ type: 'text', text: { content: text.substring(0, 2000) } }];
}

function markdownToNotionBlocks(markdown) {
  const blocks = [];
  const tokens = lexer(markdown);

  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        const headingType =
          token.depth === 1 ? 'heading_1' : token.depth === 2 ? 'heading_2' : 'heading_3';
        blocks.push({
          object: 'block',
          type: headingType,
          [headingType]: {
            rich_text: parseInlineFormatting(token.text),
          },
        });
        break;

      case 'paragraph':
        if (!token.text.trim()) break;
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: parseInlineFormatting(token.text),
          },
        });
        break;

      case 'list':
        const listType = token.ordered ? 'numbered_list_item' : 'bulleted_list_item';
        for (const item of token.items) {
          blocks.push({
            object: 'block',
            type: listType,
            [listType]: {
              rich_text: parseInlineFormatting(item.text),
            },
          });
        }
        break;

      case 'code':
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: parseInlineFormatting(token.text),
            language: token.lang || 'plain text',
          },
        });
        break;

      case 'blockquote':
        blocks.push({
          object: 'block',
          type: 'quote',
          quote: {
            rich_text: parseInlineFormatting(token.text),
          },
        });
        break;

      case 'space':
      case 'hr':
        break;

      default:
        if (token.raw && token.raw.trim()) {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: parseInlineFormatting(token.raw),
            },
          });
        }
        break;
    }
  }

  return blocks;
}

module.exports = { markdownToNotionBlocks };
