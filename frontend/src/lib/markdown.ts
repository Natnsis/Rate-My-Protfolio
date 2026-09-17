export type InlineNode =
	| { t: 'text'; v: string }
	| { t: 'strong'; v: InlineNode[] }
	| { t: 'em'; v: InlineNode[] }
	| { t: 'code'; v: string }
	| { t: 'link'; v: InlineNode[]; href: string };

export type Block =
	| { t: 'h'; level: number; v: InlineNode[] }
	| { t: 'p'; v: InlineNode[] }
	| { t: 'ul'; v: InlineNode[][] }
	| { t: 'ol'; v: InlineNode[][] }
	| { t: 'quote'; v: InlineNode[] }
	| { t: 'code'; lang: string; v: string }
	| { t: 'hr' };

function parseInline(src: string): InlineNode[] {
	const out: InlineNode[] = [];
	let i = 0;
	let buf = '';
	const flush = () => {
		if (buf) {
			out.push({ t: 'text', v: buf });
			buf = '';
		}
	};
	while (i < src.length) {
		const ch = src[i];
		if (ch === '`') {
			const end = src.indexOf('`', i + 1);
			if (end === -1) {
				buf += ch;
				i++;
				continue;
			}
			flush();
			out.push({ t: 'code', v: src.slice(i + 1, end) });
			i = end + 1;
			continue;
		}
		if (src.startsWith('**', i)) {
			const end = src.indexOf('**', i + 2);
			if (end === -1) {
				buf += ch;
				i++;
				continue;
			}
			flush();
			out.push({ t: 'strong', v: parseInline(src.slice(i + 2, end)) });
			i = end + 2;
			continue;
		}
		if (ch === '*' && src[i + 1] !== '*') {
			const end = src.indexOf('*', i + 1);
			if (end === -1 || src[end + 1] === '*') {
				buf += ch;
				i++;
				continue;
			}
			flush();
			out.push({ t: 'em', v: parseInline(src.slice(i + 1, end)) });
			i = end + 1;
			continue;
		}
		if (ch === '[') {
			const m = /\[([^\]]*)\]\(([^)\s]+)\)/.exec(src.slice(i));
			if (m && /^(https?:\/\/|mailto:|#|\/)/i.test(m[2])) {
				flush();
				out.push({ t: 'link', href: m[2], v: parseInline(m[1]) });
				i += m[0].length;
				continue;
			}
			buf += ch;
			i++;
			continue;
		}
		buf += ch;
		i++;
	}
	flush();
	return out;
}

function listItemParts(content: string): string[] {
	const re = /(?<=^|\s)(\d+[.)]|[-*+])\s+(?=\S)/g;
	const matches = [...content.matchAll(re)];
	if (matches.length === 0) return [content];
	const parts: string[] = [];
	let last = 0;
	for (let k = 0; k < matches.length; k++) {
		const m = matches[k];
		if (k === 0 && m.index === 0) continue;
		parts.push(content.slice(last, m.index).trim());
		last = m.index + m[0].length;
	}
	parts.push(content.slice(last).trim());
	return parts.filter(Boolean);
}

const HR = /^([-*_])\1{2,}\s*$/;
const HEADING = /^(#{1,4})\s+(.*)$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

export function parseMarkdown(source: string): Block[] {
	const lines = source.replace(/\r\n/g, '\n').split('\n');
	const blocks: Block[] = [];
	let para: string[] = [];
	const flushPara = () => {
		if (para.length) {
			blocks.push({ t: 'p', v: parseInline(para.join(' ')) });
			para = [];
		}
	};

	let i = 0;
	while (i < lines.length) {
		const line = lines[i];

		if (line.startsWith('```')) {
			flushPara();
			const lang = line.slice(3).trim();
			const buf: string[] = [];
			i++;
			while (i < lines.length && !lines[i].startsWith('```')) {
				buf.push(lines[i]);
				i++;
			}
			i++;
			blocks.push({ t: 'code', lang, v: buf.join('\n') });
			continue;
		}

		const heading = HEADING.exec(line);
		if (heading) {
			flushPara();
			blocks.push({ t: 'h', level: heading[1].length, v: parseInline(heading[2].trim()) });
			i++;
			continue;
		}

		if (HR.test(line)) {
			flushPara();
			blocks.push({ t: 'hr' });
			i++;
			continue;
		}

		if (/^>\s?/.test(line)) {
			flushPara();
			blocks.push({ t: 'quote', v: parseInline(line.replace(/^>\s?/, '')) });
			i++;
			continue;
		}

		const item = LIST_ITEM.exec(line);
		if (item && item[1] === '') {
			flushPara();
			const ordered = /^\d/.test(item[2]);
			const items: string[] = [];
			while (i < lines.length) {
				const m = LIST_ITEM.exec(lines[i]);
				if (!m || m[1] !== '') break;
				items.push(...listItemParts(m[3]));
				i++;
			}
			blocks.push({
				t: ordered ? 'ol' : 'ul',
				v: items.map((it) => parseInline(it))
			});
			continue;
		}

		if (line.trim() === '') {
			flushPara();
			i++;
			continue;
		}

		para.push(line);
		i++;
	}
	flushPara();
	return blocks;
}