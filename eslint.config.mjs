import config from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'

import { ts } from './eslintRuleOptions/index.mjs'

export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': [
        'error',
        ts.preferReadonlyParameterTypes
      ]
    }
  }
]
