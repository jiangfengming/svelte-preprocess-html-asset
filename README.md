# svelte-preprocess-html-asset
Transform html asset relative path. It works with snowpack & webpack 5.

e.g.

before:
```html
<img src="foo.png">
```

after:
```html
<img src="{new URL('foo.png', import.meta.url)}">
```

## Usage
svelte.config.js:

```js
const preprocessHtmlAsset = require('svelte-preprocess-html-asset');

module.exports = {
  preprocess: [
    preprocessHtmlAsset()
  ]
};
```

## Options

```js
preprocessHtmlAsset({ rules, filter })
```

### rules
`Array`. Add custom rules. Build-in rules:

```js
const defaultRules = [
  {
    tag: 'img',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'img',
    attribute: 'srcset',
    type: 'srcset'
  },

  {
    tag: 'input',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'audio',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'video',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'video',
    attribute: 'poster',
    type: 'src'
  },

  {
    tag: 'source',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'source',
    attribute: 'srcset',
    type: 'srcset'
  },

  {
    tag: 'track',
    attribute: 'src',
    type: 'src'
  },

  {
    tag: 'link',
    attribute: 'href',
    type: 'src'
  },

  {
    tag: 'object',
    attribute: 'data',
    type: 'src'
  },

  {
    tag: 'embed',
    attribute: 'src',
    type: 'src'
  }
];
```

### filter

```js
filter(path) -> Boolean
```

Filter the path. Return `true` to transform, or return `false` to skip the path.


## Transform css url()
Use https://github.com/canadaduane/snowpack-plugin-relative-css-urls

## License
[MIT](LICENSE)
