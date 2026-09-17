// verify.mjs — web-menu 검사: 폭별 진입→첫 화면, 풀페이지, 메뉴 항목 탭 → 상세 시트 열림 → Escape 닫힘
// 사용: node verify.mjs <url> <출력폴더> [항목선택자=.item] [리빌표시클래스=lit]
// 필요: playwright
import { chromium } from 'playwright';
const [,, url, out = '.', itemSel = '.item', litCls = 'lit'] = process.argv;
if (!url) { console.error('usage: node verify.mjs <url> <outdir> [itemSelector] [revealClass]'); process.exit(1); }
const sheetOpen = () => [...document.querySelectorAll('dialog[open], .sheet.open, .sheet.on, [role="dialog"]')]
  .some(e => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && e.getBoundingClientRect().height > 0; });
const b = await chromium.launch();
const log = [];
for (const [w, h] of [[320, 640], [390, 844], [430, 932], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 800 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('response', r => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/${w}-0intro.png` });
  await p.waitForTimeout(5000);
  await p.screenshot({ path: `${out}/${w}-1first.png` });
  const r = { hscroll: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
  const item = await p.$(itemSel);
  if (item) {
    await item.scrollIntoViewIfNeeded();
    await item.click();
    await p.waitForTimeout(600);
    r.sheet = await p.evaluate(sheetOpen);
    await p.screenshot({ path: `${out}/${w}-2sheet.png` });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
    r.closed = !(await p.evaluate(sheetOpen));
  } else r.noItem = itemSel;
  await p.evaluate(c => document.querySelectorAll('.rv').forEach(e => e.classList.add(c, 'in')), litCls);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${w}-3full.png`, fullPage: true });
  const ok = !r.hscroll && r.sheet && r.closed && !errs.length;
  log.push(`${w} ${ok ? 'OK' : 'CHECK'} ${JSON.stringify(r)}${errs.length ? ' errors=' + JSON.stringify(errs.slice(0, 5)) : ''}`);
  await p.close();
}
console.log(log.join('\n'));
await b.close();
