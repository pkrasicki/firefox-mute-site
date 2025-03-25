const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports =
{
	entry: "./background.js",
	mode: "development",
	devtool: process.env.NODE_ENV == "production" ? "source-map" : "inline-source-map",
	output:
	{
		path: path.resolve(__dirname, "dist"),
		filename: "background.js",
	},
	module:
	{
		rules:
		[
			{
				test: /\.html$/,
				loader: "html-loader"
			}
		]
	},
	plugins:
	[
		new HtmlWebpackPlugin(
		{
			filename: "settingsPage.html",
			template: "./settingsPage/settingsPage.html"
		})
	]
};