/**
 * Copyright (C) 2026 Tamborconpatas <Tambotconpatas@proton.me>
 *
 * Licensed under the MIT License with the Commons Clause restriction.
 * See LICENSE.md for full terms.
 */
const { search } = require('ddg-scraper');

async function performSearch(query) {
  try {
    const results = await search(query);
    return results.slice(0, 3).map(r => `[${r.title}](${r.url}): ${r.description}`).join('\n');
  } catch (error) {
    console.error('Error in search:', error.message);
    return 'No se pudo realizar la búsqueda externa.';
  }
}

module.exports = { performSearch };
