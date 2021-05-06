# cuelang-js

[CUE](https://github.com/cuelang/cue) for node.js & browser using WASM. Supports all commands of the CUE CLI.

- CUE: v0.4.0-beta.1
- Built with Go: 1.15.6

## Install

`npm install cuelang-js --save`

## Usage node.js

In node.js `.cue` files are loaded from the local file system.

```javascript
import cue from 'cuelang-js'

const result = await cue('export', ['/path/to/your.cue'], {"--out": "json"})
```

## Usage browser

In browser `.cue` files are loaded via `memfs`. Write your files to `memfs` before executing a command.

```javascript
import cue, { memfs } from 'cuelang-js'

await memfs.writeFileSync('/your.cue', 'hello: "world"');
const result = await cue('export', ['/your.cue'], {"--out": "json"})
```

## Imports

For external imports CUE will check the current working directory for a `cue.mod` directory.

Given the following import CUE will attempt to import from `./cue.mod/pkg/example/test`

```cue
import (
	"example.com/test"
)
```

In the browser the current working directory path is root (`/`) use `memfs` to write your external package to the expected paths.

```javascript
await memfs.mkdirSync('/cue.mod/pkg/example.com/test', { recursive: true })
await memfs.writeFileSync('/cue.mod/pkg/example.com/test/test.cue', 'package test\nmessage: "I was imported!"')
```

## Version tracking

| CUE             | cuelang-js         |
| --------------- | ------------------ |
| v0.4.0-beta.1   | 1.3.0              |
| v0.3.2          | 1.2.0              |

### Updating CUE

Feel free to PR if the CUE version needs bumping.

1. In `package.json` update `CUE_VERSION` and run `npm run build:wasm`.
1. Update CUE version at the top of this document
1. Add new version to the version tracking table above.

## Learning Resources

- [CUE Docs](https://cuelang.org/docs/) - Official documentation
- [CUE Discussions](https://github.com/cuelang/cue/discussions) - Recommended for questions & answers
- [CUE Language Specification](https://github.com/cuelang/cue/blob/master/doc/ref/spec.md) - Let's get technical
- [CUE Standard Packages](https://github.com/cuelang/cue/blob/master/doc/ref/spec.md) - Available packages for import
- [CUEtorials](https://cuetorials.com/) - CUE tutorials by the Hofstadter team
- [CUE Playground](https://cuelang.org/play/#cue@export@cue) - Experiment with CUE in the browser
- [CUE Playground Tip](https://tip.cuelang.org/play/#cue@export@cue) - Same as above but with the latests alpha version of CUE
- [CUE Kubernetes Tutorial](https://github.com/cuelang/cue/blob/v0.3.2/doc/tutorial/kubernetes/README.md) - Learn how CUE can dramatically simplify Kubernetes configuration
