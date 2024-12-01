import type { ReadonlyDeep } from 'type-fest'
import type { IColumnValuePair } from '../../InsertBuilderBase/types'

import { ArrayStringifier } from 'simple-common-utils'

export class PairArrayStringifier extends ArrayStringifier<IColumnValuePair> {
  constructor(
    pairs: ReadonlyDeep<IColumnValuePair[]>,
    tableName: string,
    where: string
  ) {
    super(pairs)

    this.setPrefix(['UPDATE', tableName, 'SET '].join(' ')).setPostfix(where)
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected override getStringifiedElement(
    __: number,
    { columnName, stringifiedValue }: Readonly<IColumnValuePair>
  ): string {
    return [columnName, '=', stringifiedValue].join(' ')
  }
}
