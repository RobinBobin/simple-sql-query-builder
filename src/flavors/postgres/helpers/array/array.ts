import type {
  TCellValue,
  TCellValues
} from '../../../../builders/WhereBuilderBase/types'
import type { TArray } from './types'

import { isString } from 'radashi'
import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

import { FLAVOR_OPTIONS } from '../../flavorOptions'

class ValueArrayStringifier extends ArrayStringifier<TCellValue> {
  constructor(values: TCellValues) {
    super(values)

    this.setPrefix('ARRAY[')
    this.setPostfix(']')
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected override getStringifiedElement(
    __: number,
    value: TCellValue
  ): string {
    return quoteIfString(value, {
      quotingSymbol: FLAVOR_OPTIONS.quotingSymbol
    }).toString()
  }
}

export const array = (ar: TArray): string => {
  return isString(ar) ? ar : new ValueArrayStringifier(ar).toString()
}
