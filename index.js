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

module.exports = ({ rules, filter } = {}) => {
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

  function replace(content, offset, start, end, repl) {
    content = content.slice(0, start + offset) + repl + content.slice(end + offset);
    offset += repl.length - (end - start);
    return { content, offset };
  }

  function replaceSrcset(content, offset, start, end, srcset) {
    const repl = srcset.replace(/(^\s*|,\s*)([^,\s]+)/g, (match, p1, p2) => {
      if (isLocalPath(p2)) {
        return p1 + transform(p2);
      } else {
        return match;
      }
    });

    return replace(content, offset, start, end, repl);
  }

  return {
    markup({ content }) {
      const regex = new RegExp(`<(${[...new Set(rules.map(rule => rule.tag))].join('|')})\\s+[^>]+>`, 'gi');
      const copy = content;
      let match;
      let offset = 0;

      while ((match = regex.exec(copy)) !== null) {
        const tag = match[0];
        const base = match.index;

        try {
          const ast = svelte.parse(tag);
          const node = ast.html.children[0];
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
                    ({ content, offset } = replace(
                      content,
                      offset,
                      val.start + base,
                      val.end + base,
                      transform(val.data))
                    );
                  }
                } else {
                  ({ content, offset } = replaceSrcset(content, offset, val.start + base, val.end + base, val.data));
                }
              }
            });
          }
        } catch (e) {
          // nop
        }
      }

      return { code: content };
    }
  };
};
