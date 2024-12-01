import type { ReadonlyDeep } from 'type-fest'

import { ArrayStringifier } from 'simple-common-utils'

export class ColumnNameStringifier extends ArrayStringifier<string> {
  constructor(columnNames: ReadonlyDeep<string[]>, tableName: string) {
    super(columnNames)

    this.setPrefix(['INSERT INTO', tableName, '('].join(' '))
    this.setPostfix(')')
  }
}
