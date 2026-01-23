module.exports = {
	plugins: [
		require("postcss-preset-env")({
			stage: 2,
			features: {
				"oklab-function": false,
				"custom-properties": false,
			},
			}),
		require("autoprefixer"),
		require("cssnano")({
			preset: ["default", {
				calc: false,
			}],
		}),
	],
};
