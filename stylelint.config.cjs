/* eslint-env node */
module.exports = {
  customSyntax: 'postcss-scss',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-vue/scss',
  ],
  // plugins: ['stylelint-declaration-block-no-ignored-properties'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  overrides: [
    {
      customSyntax: 'postcss-html',
      files: ["*.vue", "**/*.vue"],
      rules: {}
    }
  ],
  rules: {
    'max-line-length': null,
    'selector-class-pattern': null,
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'after-same-name',
          'blockless-after-blockless',
          'first-nested'
        ],
        ignore: ['after-comment'],
        ignoreAtRules: ['else']
      }
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements', 'default-namespace']
      }
    ],
    'no-descending-specificity': null,
    'function-no-unknown': null
  }
}
