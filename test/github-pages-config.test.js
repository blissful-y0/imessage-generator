import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const viteConfigPath = new URL('../vite.config.js', import.meta.url);
const workflowPath = new URL('../.github/workflows/deploy-pages.yml', import.meta.url);
const gitignorePath = new URL('../.gitignore', import.meta.url);

test('github pages deploy config is present', async () => {
  const [viteConfig, workflow, gitignore] = await Promise.all([
    readFile(viteConfigPath, 'utf8'),
    readFile(workflowPath, 'utf8'),
    readFile(gitignorePath, 'utf8'),
  ]);

  assert.match(viteConfig, /base:\s*['"]\.\/['"]/);
  assert.match(workflow, /actions\/configure-pages@/);
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /actions\/deploy-pages@/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build/);
  assert.match(gitignore, /node_modules/);
  assert.match(gitignore, /dist/);
});
