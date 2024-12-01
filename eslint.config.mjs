import config from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'

export default [
  ...config,
  {
    ignores: ['legacy']
  }
]
