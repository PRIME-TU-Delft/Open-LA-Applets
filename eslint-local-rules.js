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
  },

  'require-url-params-info': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require appletState.URLParamsInfo to be set when using searchParams in applets',
        category: 'Best Practices',
        recommended: true
      },
      messages: {
        missingURLParamsInfo:
          'searchParams is used in this applet, but appletState.URLParamsInfo is not set. You must document all URL parameters used.'
      },
      schema: []
    },
    create(context) {
      const filename = context.getFilename();

      // Only check applet files
      if (!filename.includes('/applet/') || !filename.endsWith('+page.svelte')) {
        return {};
      }

      let hasSearchParamsUsage = false;
      let hasURLParamsInfo = false;
      let searchParamsNode = null;

      return {
        Identifier(node) {
          // Check for searchParams usage
          if (node.name === 'searchParams') {
            hasSearchParamsUsage = true;
            searchParamsNode = node;
          }
        },

        AssignmentExpression(node) {
          // Check for appletState.URLParamsInfo assignment
          if (
            node.left?.type === 'MemberExpression' &&
            node.left?.object?.name === 'appletState' &&
            node.left?.property?.name === 'URLParamsInfo'
          ) {
            hasURLParamsInfo = true;
          }
        },

        'Program:exit'() {
          if (hasSearchParamsUsage && !hasURLParamsInfo && searchParamsNode) {
            context.report({
              node: searchParamsNode,
              messageId: 'missingURLParamsInfo'
            });
          }
        }
      };
    }
  }
};
