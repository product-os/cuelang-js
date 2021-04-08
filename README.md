# cuelang-js

[CUE](https://github.com/cuelang/cue) for node.js & browser using WASM. Supports all commands of the CUE CLI. 

## Install

`npm install cuelang-js --save`

## Usage node.js

In node.js `.cue` files will be loaded from the local file system

```
import cue from 'cuelang-js'

cue('export', ['/path/to/your.cue'], {"--out": "json"})
	.then(result => console.log(result.stdout))
```

## Usage browser

In browser the `.cue` files will be loaded via `memfs`. Write your files to `memfs` before evaluating them.

```
import cue, { memfs } from 'cuelang-js'

const memfs.writeFileSync('/your.cue', 'hello: "world"');
const result = await cue('export', ['/your.cue'], {"--out": "json"})
```


