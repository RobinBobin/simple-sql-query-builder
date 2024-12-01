import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TCellValue } from '../WhereBuilderBase/types'
import type { IColumnValuePair } from './types'

import { quoteIfString } from 'simple-common-utils'

export class InsertBuilderBase {
  protected readonly pairs: IColumnValuePair[] = []

  constructor(
    protected readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    protected readonly tableName: string
  ) {
    // Nothing to do
  }

  columnValue(
    columnName: string,
    value: TCellValue,
    shouldAdd = true,
    shouldQuoteIfString = true
  ): this {
    if (shouldAdd) {
      this.pairs.push({
        columnName,
        stringifiedValue: quoteIfString(value, {
          quotingSymbol: this.flavorOptions.quotingSymbol,
          shouldSkip: !shouldQuoteIfString || value === 'NULL'
        }).toString()
      })
    }

    return this
  }

  toString(): string {
    const get = (propertyName: keyof IColumnValuePair): string =>
      this.pairs
        .map((pair: Readonly<IColumnValuePair>) => pair[propertyName])
        .join(', ')

    return [
      'INSERT INTO',
      this.tableName,
      '(',
      get('columnName'),
      ') VALUES (',
      get('stringifiedValue'),
      ')'
    ].join(' ')
  }
}
