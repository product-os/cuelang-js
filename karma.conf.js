const getKarmaConfig = require('balena-config-karma');
const packageJSON = require('./package.json');
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path')

module.exports = (config) => {
	const karmaConfig = getKarmaConfig(packageJSON);
	karmaConfig.files.push({pattern: 'lib/cue.wasm', included: false, served: true, type: 'wasm'})
	karmaConfig.files.push({pattern: 'tests/fixtures/*.cue', included: false, served: true, type: 'text'})
	karmaConfig.webpack.node = {fs: 'empty'}
	karmaConfig.webpack.module.noParse = /wasm_exec\.js$/
	karmaConfig.proxies = {
		'/cue.wasm': '/base/lib/cue.wasm',
		'/fixtures/': '/base/tests/fixtures/'
	}
	config.set(karmaConfig);
};
