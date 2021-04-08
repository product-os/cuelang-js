# cuelang-js

[CUE](https://github.com/cuelang/cue) for node.js & browser using WASM. Supports all commands of the CUE CLI. 

## Install

`npm install cuelang-js --save`

## Usage node.js

In node.js `.cue` files will be loaded from the local file system

```
const result = await cue('export', ['/path/to/your.cue'], {"--out": "json"})
```

## Usage browser

In browser the `.cue` files will be loaded via `memfs`. Write your files to `memfs` before evaluating them.

```
import { fs as memfs } from 'memfs';

const memfs.writeFileSync('/your.cue', 'hello: "world"');
const result = await cue('export', ['/your.cue'], {"--out": "json"})
```


