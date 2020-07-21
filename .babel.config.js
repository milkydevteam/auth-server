module.exports = {
  "presets": ["@babel/preset-env", "es2015", "env"],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./"],
        "extensions": [".js", ".ts", ".tsx", ".json"],
        "alias": {
          "@": "./src"
        }
      }
    ]
  ]
}
