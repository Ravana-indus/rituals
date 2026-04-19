import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

test('Home2 renders a beauty-commerce landing page narrative', async () => {
  let pageModule: { default?: React.ComponentType } | null = null;

  try {
    pageModule = await import('./Home2.tsx');
  } catch {
    pageModule = null;
  }

  assert.ok(pageModule?.default, 'Expected src/pages/Home2.tsx to export a default page component');

  const Home2 = pageModule.default;
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <Home2 />
    </MemoryRouter>
  );

  assert.match(markup, /Lakbima Beauty/i);
  assert.match(markup, /Shop New Arrivals|Explore the Collection/i);
  assert.match(markup, /Delivery/i);
});

test('App registers the /home2 route', async () => {
  const appSource = await readFile(new URL('../App.tsx', import.meta.url), 'utf8');
  assert.match(appSource, /path="\/home2"/);
});
