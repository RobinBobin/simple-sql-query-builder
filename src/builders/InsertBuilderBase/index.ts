import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TColumnValue } from '../WhereBuilderBase/types'
import type { IColumnValuePair } from './types'

import { ColumnNameStringifier } from './ColumnNameStringifier'
import { ColumnValueStringifier } from './ColumnValueStringifier'

export class InsertBuilderBase {
  protected readonly pairs: IColumnValuePair[] = []

  constructor(
    protected readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    protected readonly tableName: string
  ) {
    // Nothing to do
  }

  columnValue(name: string, value: TColumnValue, shouldAdd = true): this {
    if (shouldAdd) {
      this.pairs.push({ name, value })
    }

    return this
  }

  toString(): string {
    // if (this._finalizeToStringProcessing) {
    //   str = this._finalizeToStringProcessing(str)
    // }

    return [
      new ColumnNameStringifier(
        this.pairs.map(({ name }: Readonly<IColumnValuePair>) => name),
        this.tableName
      ),
      new ColumnValueStringifier(
        this.flavorOptions,
        this.pairs.map(({ value }: Readonly<IColumnValuePair>) => value)
      )
    ].join(' ')
  }
}
