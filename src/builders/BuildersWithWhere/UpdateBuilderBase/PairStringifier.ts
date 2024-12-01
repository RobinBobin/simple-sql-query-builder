import type { ReadonlyDeep } from 'type-fest'
import type { ISqlFlavorOptions } from '../../../flavors/types'
import type { IColumnValuePair } from '../../InsertBuilderBase/types'

import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

export class PairStringifier extends ArrayStringifier<IColumnValuePair> {
  constructor(
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    pairs: ReadonlyDeep<IColumnValuePair[]>,
    tableName: string,
    where: string
  ) {
    super(pairs)

    this.setPrefix(['UPDATE', tableName, 'SET '].join(' ')).setPostfix(where)
  }

  protected override getStringifiedElement(
    __: number,
    { name, value }: Readonly<IColumnValuePair>
  ): string {
    return [
      name,
      '=',
      quoteIfString(value, {
        quotingSymbol: this.flavorOptions.quotingSymbol,
        shouldSkip: value === 'NULL'
      })
    ].join(' ')
  }
}
