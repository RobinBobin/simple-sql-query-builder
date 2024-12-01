import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TForeignKeyAction } from './types'

import { ArrayStringifier, quoteIfString } from 'simple-common-utils'

import { Entry } from '../Entry'

export class Column extends Entry {
  constructor(
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    name: string,
    private readonly type: string
  ) {
    super(name)
  }

  default(value: number | string): this {
    return this.attr(
      `DEFAULT ${quoteIfString(value, {
        quotingSymbol: this.flavorOptions.quotingSymbol
      })}`
    )
  }

  foreign(tableName: string, columnName: string): this {
    return this.attr(`REFERENCES ${tableName}(${columnName})`)
  }

  notNull(): this {
    return this.attr('NOT NULL')
  }

  onDelete(action: TForeignKeyAction): this {
    return this.attr(`ON DELETE ${action}`)
  }

  primary(): this {
    return this.attr('PRIMARY KEY')
  }

  override toString(): string {
    return new ArrayStringifier(this.attrs, ' ')
      .setPrefix(
        new ArrayStringifier([this.name, this.type], ' ')
          .setPostfix(' ')
          .toString()
      )
      .toString()
  }
}
