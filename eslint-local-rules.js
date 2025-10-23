/**
 * Custom ESLint rules for the Open-LA-Applets project
 */

export default {
  'no-hardcoded-title': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow hardcoded strings in title attributes, require translation keys',
        category: 'Best Practices',
        recommended: true
      },
      messages: {
        hardcodedTitle:
          'Hardcoded string "{{value}}" in title attribute. Use a translation key instead: title={$_(\'applets...\')}'
      },
      schema: []
    },
    create(context) {
      return {
        SvelteAttribute(node) {
          if (node.key?.name !== 'title') {
            return;
          }

          if (node.value && node.value.length > 0) {
            const value = node.value[0];

            if (value.type === 'SvelteLiteral' || value.type === 'Literal') {
              context.report({
                node,
                messageId: 'hardcodedTitle',
                data: {
                  value: value.value
                }
              });
            }

            if (value.type === 'SvelteMustacheTag') {
              const expression = value.expression;

              if (expression?.type === 'CallExpression') {
                const callee = expression.callee;
                if (callee?.type === 'Identifier' && callee.name === '$_') {
                  return; // valid
                }
              }
            }
          }
        }
      };
    }
  }
};
