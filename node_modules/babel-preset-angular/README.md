# babel-preset-angular

> Babel preset for all angular plugins.

## Install

```sh
$ npm install --save-dev babel-preset-angular
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["angular"]
}
```

### Via CLI

```sh
$ babel script.js --preset angular
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  presets: ["angular"]
});
```
