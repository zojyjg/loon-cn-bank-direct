import { mkdir, readFile, writeFile } from 'node:fs/promises';

const rawBase = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Loon';
const config = JSON.parse(await readFile(new URL('../sources.json', import.meta.url), 'utf8'));
const validRule = /^(?:DOMAIN(?:-SUFFIX|-KEYWORD)?|IP-CIDR6?|IP-ASN|GEOIP),/;

// 上游文件仅提供匹配条件；DIRECT 策略由 Loon 的 RULE-SET 引用处指定。
const responses = await Promise.all(
  config.directories.map(async (directory) => {
    const url = `${rawBase}/${directory}/${directory}.list`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${directory}: HTTP ${response.status}`);
    return { directory, url, text: await response.text() };
  }),
);

const rules = new Set();
for (const { text } of responses) {
  for (const line of text.split(/\r?\n/)) {
    const rule = line.trim();
    if (validRule.test(rule)) rules.add(rule);
  }
}

const output = [
  '# NAME: ChinaBankDirect',
  '# REPO: https://github.com/zojyjg/loon-cn-bank-direct',
  '# SOURCE: https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Loon',
  `# UPDATED: ${new Date().toISOString()}`,
  `# SOURCES: ${config.directories.join(', ')}`,
  `# TOTAL: ${rules.size}`,
  '',
  ...[...rules].sort(),
  '',
].join('\n');

await mkdir(new URL('../', import.meta.url), { recursive: true });
await writeFile(new URL('../BankDirect.list', import.meta.url), output);
console.log(`Generated ${rules.size} rules from ${responses.length} upstream lists.`);
