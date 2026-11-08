export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
  ignoreFiles: ['dist/**', 'unpackage/**', 'node_modules/**', 'src/static/**'],
  rules: {
    // uni-app 扩展单位与内置标签，需要放行
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx', 'upx'],
      },
    ],
    'selector-type-no-unknown': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'tailwind', 'unocss', 'screen'],
      },
    ],
    'no-empty-source': null,
    // 允许按语义分组变量，提升 uni.scss 可读性
    'scss/dollar-variable-empty-line-before': null,
    // 模板统一使用 kebab-case + BEM
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        message: 'Expected class selector to be kebab-case or BEM',
      },
    ],
  },
}
