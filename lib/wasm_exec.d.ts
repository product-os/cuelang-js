/**
 * This implements the interface of the `Go` class in wasm_exec.js **partially**, including only the methods we need.
 */
declare class Go {
	constructor();

	importObject: WebAssembly.Imports;
	run(instance: WebAssembly.Instance): Promise<void>;

	argv: string[];
	env: any;
	exit: (code: number) => void;
}

declare global {
	let fs: any;
	let stdout: string;
	let stderr: string;
}
