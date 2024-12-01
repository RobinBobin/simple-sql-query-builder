import type { ReadonlyDeep } from 'type-fest'
import type { ISqlFlavorOptions } from '../../../flavors/types'
import type { IColumn } from './types'

import { isUndefined } from 'radashi'
import { ArrayStringifier } from 'simple-common-utils'

export class ColumnArrayStringifier extends ArrayStringifier<IColumn> {
  constructor(
    columns: ReadonlyDeep<IColumn[]>,
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>
  ) {
    super(columns)

    this.setPrefix('SELECT ')
  }

  protected override getStringifiedElement(
    __: number,
    { alias, columnName }: Readonly<IColumn>
  ): string {
    if (isUndefined(alias)) {
      return columnName
    }

    return [
      columnName,
      ' AS ',
      this.flavorOptions.columnNameQuotingSymbol,
      alias,
      this.flavorOptions.columnNameQuotingSymbol
    ].join('')
  }
}
