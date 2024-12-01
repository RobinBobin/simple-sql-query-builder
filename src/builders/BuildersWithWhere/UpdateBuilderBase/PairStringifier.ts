import type { ReadonlyDeep } from 'type-fest'
import type { ISqlFlavorOptions } from '../../../flavors/types'
import type { IPair } from '../../InsertBuilderBase/types'

import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

export class PairStringifier extends ArrayStringifier<IPair> {
  constructor(
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    pairs: ReadonlyDeep<IPair[]>,
    tableName: string,
    where: string
  ) {
    super(pairs)

    this.setPrefix(['UPDATE', tableName, 'SET '].join(' ')).setPostfix(where)
  }

  protected override getStringifiedElement(
    __: number,
    { columnName, columnValue }: Readonly<IPair>
  ): string {
    return [
      columnName,
      '=',
      quoteIfString(columnValue, {
        quotingSymbol: this.flavorOptions.quotingSymbol,
        shouldSkip: columnValue === 'NULL'
      })
    ].join(' ')
  }
}
