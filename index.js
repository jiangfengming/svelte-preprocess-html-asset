const svelte = require('svelte/compiler');

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

module.exports = function({ rules, filter } = {}) {
  rules = defaultRules.concat(rules || []);

  function transform(path) {
    return `{new URL('${path}', import.meta.url)}`;
  }

  function isLocalPath(path) {
    return !path.startsWith('http:') &&
      !path.startsWith('https:') &&
      !path.startsWith('//') &&
      !filter || filter(path);
  }

  function replace(content, offset, repl, start, end) {
    content = content.slice(0, start + offset) + repl + content.slice(end + offset);
    offset += repl.length - repl.length;
    return { content, offset };
  }

  function replaceSrcset(content, offset, srcset, start, end) {
    const repl = srcset.replace(/(^\s*|,\s*)([^,\s]+)/g, (match, p1, p2) => {
      if (isLocalPath(p2)) {
        return p1 + transform(p2);
      } else {
        return match;
      }
    });

    return replace(content, offset, repl, start, end);
  }

  return {
    markup({ content }) {
      const ast = svelte.parse(content);

      if (ast.html) {
        let offset = 0;

        svelte.walk(ast.html, {
          enter(node) {
            if (node.type === 'Element') {
              const rulesOfTag = rules.filter(rule => rule.tag === node.name);

              if (rulesOfTag.length) {
                node.attributes.forEach(attr => {
                  const rule = rulesOfTag.find(rule => rule.attribute === attr.name);

                  if (
                    rule &&
                    attr.value instanceof Array &&
                    attr.value.length === 1 &&
                    attr.value[0].type === 'Text'
                  ) {
                    const val = attr.value[0];

                    if (rule.type === 'src') {
                      if (isLocalPath(val.data)) {
                        ({ content, offset } = replace(content, offset, transform(val.data), val.start, val.end));
                      }
                    } else {
                      ({ content, offset } = replaceSrcset(content, offset, val.data, val.start, val.end));
                    }
                  }
                });
              }
            }
          }
        });
      }

      return {
        code: content
      };
    }
  };
};
