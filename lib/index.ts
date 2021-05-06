import * as path from 'path';
import './wasm_exec';
import * as nodefs from 'fs';
import { fs as memfs } from 'memfs';
export { memfs }

let moduleCache: WebAssembly.Module | null = null;

// declare fs, stdout and stderr on global so they are available in both browser and node.js
interface Global extends NodeJS.Global {
	fs: any;
	stdout: string;
	stderr: string;
}
declare const global: Global;

export const isBrowser =
	typeof window !== 'undefined' && typeof window.document !== 'undefined';

// use in memory fs for browser
if (isBrowser) {
	global.fs = memfs;
}
global.stdout = '';
global.stderr = '';
global.fs = new Proxy(global.fs, {
	get: function (target, property) {
		switch (property) {
			case 'constants': // expected by Go syscall/js
				if (isBrowser) {
					return {
						O_WRONLY: -1,
						O_RDWR: -1,
						O_CREAT: -1,
						O_TRUNC: -1,
						O_APPEND: -1,
						O_EXCL: -1,
					};
				} else {
					return target[property]
				}
			case 'stat': // map `.` to `/` since memfs does not support relative paths
				return (path: string, flags: number, mode: number, callback: (err: NodeJS.ErrnoException | null, fd: number) => void) => {
					if (isBrowser && path === '.') {
						path = '/';
					}
					return target[property](path, flags, mode, callback)
				}
				break;
			case 'open':
				return (filename: string, flags: number, mode: number, callback: (err: NodeJS.ErrnoException | null, fd: number) => void) => {
					return target[property](filename, flags, mode, callback)
				}
				break;
			case 'writeSync': // proxy write and writeSync to capture wasm stdout and stderr
				return (fd: number, buf: any) => {
					const decoder = new TextDecoder('utf-8');
					if (fd === 1) {
						global.stdout += decoder.decode(buf);
						return buf.length;
					} else if (fd === 2) {
						global.stderr += decoder.decode(buf);
						return buf.length;
					} else {
						return target[property](fd, buf);
					}
				}
				break;
			case 'write':
				return (
					fd: number,
					buf: any,
					_offset: number,
					_length: number,
					_position: number,
					callback: any,
				) => {
					const n = global.fs.writeSync(fd, buf);
					callback(null, n);
				};
			default:
				return target[property]
		}
	}
})

export default async function (
	command: string,
	args: string[] = [],
	flags: any = {},
) {
	if (!moduleCache && globalThis.require) {
		moduleCache = await WebAssembly.compile(
			nodefs.readFileSync(path.join(__dirname, 'cue.wasm')),
		);
	} else if (!moduleCache) {
		moduleCache = await WebAssembly.compileStreaming(fetch('cue.wasm'));
	}
	const go = new Go();
	const instance = await WebAssembly.instantiate(moduleCache, go.importObject);
	const flagList = Object.keys(flags).map((key) => {
		if (flags[key] === true) {
			return key;
		} else {
			return `${key}=${flags[key]}`;
		}
	});
	go.argv = [__filename, command, ...args, ...flagList];
	go.env = {
		PWD: '/',
	};
	let code = -1;
	go.exit = (exitCode: number) => {
		code = exitCode;
	};
	try {
		await go.run(instance);
		return { code, stdout: global.stdout, stderr: global.stderr };
	} finally {
		global.stdout = '';
		global.stderr = '';
	}
}
