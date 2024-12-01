import type { ISqlFlavorOptions } from '../../flavors/types'
import type { TUniqueCallback } from './types'

import { ArrayStringifier } from 'simple-common-utils'

import { ConditionalArray } from '../../helpers/ConditionalArray'
import { pushAndReturnElement } from '../../helpers/pushAndReturnElement'
import { Column } from './Column'
import { UniqueBuilder } from './UniqueBuilder'

export class TableBuilderBase {
  private readonly entries: (Column | UniqueBuilder)[] = []

  constructor(
    private readonly flavorOptions: Readonly<ISqlFlavorOptions>,
    private readonly ifNotExists: boolean,
    private readonly name: string
  ) {
    // Nothing to do
  }

  blob(name: string): Column {
    return this.column(name, 'BLOB')
  }

  char(name: string, length: number): Column {
    return this.column(name, `CHAR(${length})`)
  }

  column(name: string, type: string): Column {
    return pushAndReturnElement(
      this.entries,
      new Column(this.flavorOptions, name, type)
    )
  }

  integer(name: string): Column {
    return this.column(name, 'INTEGER')
  }

  real(name: string): Column {
    return this.column(name, 'REAL')
  }

  text(name: string): Column {
    return this.column(name, 'TEXT')
  }

  toString(): string {
    return new ArrayStringifier(this.entries)
      .setPrefix(
        new ConditionalArray('CREATE TABLE')
          .push(' IF NOT EXISTS', this.ifNotExists)
          .push(` ${this.name} (`)
          .toString()
      )
      .setPostfix(')')
      .toString()
  }

  unique(uniqueCallback: TUniqueCallback): void {
    uniqueCallback(pushAndReturnElement(this.entries, new UniqueBuilder()))
  }
}
