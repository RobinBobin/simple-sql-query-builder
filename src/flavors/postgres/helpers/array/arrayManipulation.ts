import type { TManipulateArray } from './types'

import { quoteIfString } from 'simple-common-utils'

import { FLAVOR_OPTIONS } from '../../flavorOptions'
import { array } from './array'

export function arrayManipulation(operation: string): TManipulateArray {
  return (ar, value) => {
    return [
      operation,
      '(',
      array(ar),
      ', ',
      quoteIfString(value, { quotingSymbol: FLAVOR_OPTIONS.quotingSymbol }),
      ')'
    ].join('')
  }
}
