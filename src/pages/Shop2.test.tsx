import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

test('Shop2 renders a dark-first storefront', async () => {
  let pageModule: { default?: React.ComponentType } | null = null;

  try {
    pageModule = await import('./Shop2.tsx');
  } catch {
    pageModule = null;
  }

  assert.ok(pageModule?.default, 'Expected src/pages/Shop2.tsx to export a default page component');

  const Shop2 = pageModule.default;
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <Shop2 />
    </MemoryRouter>
  );

  assert.match(markup, /Shop the future of beauty/i);
  assert.match(markup, /Start for free|Shop collection/i);
  assert.match(markup, /Filter by category|Neon Green/i);
});

test('App registers the /shop2 route', async () => {
  const appSource = await readFile(new URL('../App.tsx', import.meta.url), 'utf8');
  assert.match(appSource, /path="\/shop2"/);
});

test('Shop2 source uses a full-width shell and five-column product grid', async () => {
  const source = await readFile(new URL('./Shop2.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /max-w-7xl/);
  assert.match(source, /2xl:grid-cols-5/);
});
