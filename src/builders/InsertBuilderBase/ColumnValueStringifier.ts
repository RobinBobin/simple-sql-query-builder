import type { ReadonlyDeep } from 'type-fest'
import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TColumnValue } from '../WhereBuilderBase/types'

import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

export class ColumnValueStringifier extends ArrayStringifier<TColumnValue> {
  constructor(
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    values: ReadonlyDeep<TColumnValue[]>
  ) {
    super(values)

    this.setPrefix('VALUES (')
    this.setPostfix(')')
  }

  protected override getStringifiedElement(
    __: number,
    value: TColumnValue
  ): string {
    return quoteIfString(value, {
      quotingSymbol: this.flavorOptions.quotingSymbol,
      shouldSkip: value === 'NULL'
    }).toString()
  }
}
