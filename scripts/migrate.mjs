// WXR -> Markdown. Published posts/pages only; comments and drafts skipped.
import { readFileSync, writeFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const x = new XMLParser({ ignoreAttributes: false, cdataPropName: false, parseTagValue: false, isArray: (n) => ['item', 'wp:postmeta'].includes(n) });
const items = x.parse(readFileSync('stacktracingcom.WordPress.2026-10-23.xml', 'utf8')).rss.channel.item;

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' }).use(gfm);
td.addRule('wpcode', {
  filter: (n) => n.nodeName === 'PRE',
  replacement: (_, n) => '\n```\n' + n.textContent.replace(/\n$/, '') + '\n```\n',
});

const meta = (i, k) => (i['wp:postmeta'] ?? []).find((m) => m['wp:meta_key'] === k)?.['wp:meta_value'];
const q = (s) => JSON.stringify(s ?? '');
const thumbs = Object.fromEntries(items.filter((i) => i['wp:post_type'] === 'attachment').map((i) => [i['wp:post_id'], i['wp:attachment_url']]));

for (const i of items) {
  const type = i['wp:post_type'];
  if (i['wp:status'] !== 'publish' || !['post', 'page'].includes(type) || i['wp:post_name'] === 'posts') continue;
  const html = i['content:encoded'].replace(/<!--[\s\S]*?-->/g, '').replace(/<div id="ez-toc-container"[\s\S]*?<\/nav><\/div>/, '');
  const md = td.turndown(html);
  const slug = i['wp:post_name'];
  const fm = [
    `title: ${q(i.title)}`,
    `date: ${i['wp:post_date'].slice(0, 10)}`,
    `description: ${q(meta(i, 'rank_math_description') || i['excerpt:encoded'] || '')}`,
    thumbs[meta(i, '_thumbnail_id')] ? `image: ${q(thumbs[meta(i, '_thumbnail_id')])}` : '',
    `wpPath: ${q(new URL(i.link).pathname)}`,
  ].filter(Boolean).join('\n');
  writeFileSync(`src/content/${type === 'post' ? 'posts' : 'pages'}/${slug}.md`, `---\n${fm}\n---\n\n${md}\n`);
  console.log(type, slug, new URL(i.link).pathname);
}
