module.exports = {
  "presets": [
      "@babel/preset-env"
  ],
  "sourceRoot": "src",
  "plugins": [
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators", {legacy: true}],
      ["@babel/plugin-proposal-object-rest-spread"]
  ]
}
