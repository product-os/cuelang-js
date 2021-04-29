import { expect } from './chai';
import cue, { isBrowser, memfs } from '../lib';
import * as path from 'path';
import * as nodefs from 'fs';

describe('cue', function () {
	async function loadFixture(name: string): Promise<string> {
		const filePath = path.join(__dirname, 'fixtures/', name);
		const fileContents = isBrowser
			? await (await fetch(filePath)).text()
			: nodefs.readFileSync(filePath);
		if (isBrowser) {
			memfs.writeFileSync(`/${name}`, fileContents);
			return `/${name}`;
		} else {
			return filePath;
		}
	}

	it('should eval file and return output', async function () {
		await expect(
			cue('eval', [await loadFixture('concrete.cue')]),
		).to.eventually.become({
			code: 0,
			stdout: 'hello: "world"\n',
			stderr: '',
		});
	});

	it('should warn when eval abstract with --concrete flag', async function () {
		await expect(
			cue('eval', [await loadFixture('abstract.cue')], {
				'--concrete': true,
			}),
		).to.eventually.become({
			code: 1,
			stdout: '',
			stderr: 'hello: incomplete value string\n',
		});
	});

	it('should export json', async function () {
		await expect(
			cue('export', [await loadFixture('concrete.cue')], {"--out": "json"}),
		).to.eventually.become({
			code: 0,
			stdout: `{\n    \"hello\": \"world\"\n}\n`,
			stderr: '',
		});
	});

	it('should eval injected value', async function () {
		await expect(
			cue('export', [await loadFixture('inject.cue')], {"--inject": "hello=world"}),
		).to.eventually.become({
			code: 0,
			stdout: `{\n    \"hello\": \"world\"\n}\n`,
			stderr: '',
		});
	});
});
