import config from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'

import { preferReadonlyParameterTypes } from './eslintOptions/preferReadonlyParameterTypes.mjs'

export default [
  ...config,
  {
    ignores: ['legacy']
  },
  {
    rules: {
      ...preferReadonlyParameterTypes(true)
    }
  }
]
