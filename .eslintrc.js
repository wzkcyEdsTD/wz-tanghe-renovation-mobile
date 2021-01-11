module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-undef": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-unused-vars": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-dupe-keys': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/return-in-computed-property': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-side-effects-in-computed-properties': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-extra-semi': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-redeclare': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}