var webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	entry: __dirname + "/static/js/app.js",
	output: {
		path: __dirname + "/build",
		filename: "main.js",
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				exclude: /node_modules/,
			},
			{
				test: /\.vue$/,
				loader: "vue",
			}
		]
	},
	babel: {
		presets: ['latest','stage-2']
	}
}