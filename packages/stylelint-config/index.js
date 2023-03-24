/**
 * https://stylelint.io/
 */
module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-scss'],
  rules: {
    'function-url-quotes': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['/^my-/'],
      },
    ],
  },
}
