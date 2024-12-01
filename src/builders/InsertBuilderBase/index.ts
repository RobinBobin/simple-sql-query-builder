import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TColumnValue } from '../WhereBuilderBase/types'
import type { IPair } from './types'

import { ColumnNameStringifier } from './ColumnNameStringifier'
import { ColumnValueStringifier } from './ColumnValueStringifier'

export default class InsertBuilderBase {
  protected readonly pairs: IPair[] = []

  constructor(
    protected readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    protected readonly tableName: string
  ) {
    // Nothing to do
  }

  columnValue(
    columnName: string,
    columnValue: TColumnValue,
    shouldAdd = true
  ): this {
    if (shouldAdd) {
      this.pairs.push({ columnName, columnValue })
    }

    return this
  }

  toString(): string {
    // if (this._finalizeToStringProcessing) {
    //   str = this._finalizeToStringProcessing(str)
    // }

    return [
      new ColumnNameStringifier(
        this.pairs.map(({ columnName }: Readonly<IPair>) => columnName),
        this.tableName
      ),
      new ColumnValueStringifier(
        this.flavorOptions,
        this.pairs.map(({ columnValue }: Readonly<IPair>) => columnValue)
      )
    ].join(' ')
  }
}
