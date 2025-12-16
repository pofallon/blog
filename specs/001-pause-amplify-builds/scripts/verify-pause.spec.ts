import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const baseUrl = process.env.PAUSE_SITE_URL ?? 'https://prod.example.com';
const evidenceDir =
  process.env.PAUSE_EVIDENCE_DIR ??
  path.resolve(__dirname, '..', 'evidence', 'playwright');

test.describe('Pause verification', () => {
  test('captures DOM snapshot and hash', async ({ page }) => {
    mkdirSync(evidenceDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
    expect(response, 'Response should be defined').not.toBeNull();
    expect(response?.status(), 'HTTP 200 expected').toBe(200);

    const domContent = await page.content();
    const hash = createHash('sha256').update(domContent).digest('hex');

    const htmlPath = path.join(evidenceDir, `dom-${timestamp}.html`);
    const screenshotPath = path.join(evidenceDir, `screenshot-${timestamp}.png`);
    const metaPath = path.join(evidenceDir, `metadata-${timestamp}.json`);

    writeFileSync(htmlPath, domContent, 'utf8');
    writeFileSync(
      metaPath,
      JSON.stringify(
        {
          baseUrl,
          hash,
          capturedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      'utf8',
    );

    await page.screenshot({ path: screenshotPath, fullPage: true });
    test.info().annotations.push({ type: 'dom-hash', description: hash });
    console.log(`Playwright DOM hash: ${hash}`);
  });
});
