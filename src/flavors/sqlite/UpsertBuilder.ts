import type { IBuilderWithWhere } from '../../builders/BuildersWithWhere/types'
import type { TWhereBuilderCallback } from '../../builders/types'

import { isString, isUndefined } from 'radashi'
import { ArrayStringifier } from 'simple-common-utils'

import { BuilderWithWhere } from '../../builders/BuildersWithWhere/BuilderWithWhere'
import { ConditionalArray } from '../../helpers/ConditionalArray'
import { InsertBuilder } from './InsertBuilder'
import { UpdateBuilder } from './UpdateBuilder'
import { WhereBuilder } from './WhereBuilder'

export class UpsertBuilder
  extends InsertBuilder
  implements IBuilderWithWhere<WhereBuilder>
{
  private onConflictWhere?: BuilderWithWhere<WhereBuilder>
  private updateBuilder?: UpdateBuilder
  private readonly indexedColumns: string[] = []

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  doNothing(): void {
    // Nothing
  }

  doUpdate(): UpdateBuilder {
    this.updateBuilder = new UpdateBuilder(this.tableName)

    return this.updateBuilder
  }

  onConflict(...indexedColumns: readonly string[]): this {
    this.indexedColumns.push(...indexedColumns)

    return this
  }

  override toString(isFull = true, conflictingColumnName?: string): string {
    if (isFull) {
      if (isString(conflictingColumnName)) {
        throw new Error(
          "`conflictingColumnName` can't be specified if `isFull`"
        )
      }

      return new ConditionalArray()
        .push(super.toString())
        .push(' ON CONFLICT')
        .push(
          new ArrayStringifier(this.indexedColumns)
            .setPrefix(' (')
            .setPostfix(')')
            .toString(),
          Boolean(this.indexedColumns.length)
        )
        .push(
          this.onConflictWhere?.toString() ?? '',
          Boolean(this.indexedColumns.length && this.onConflictWhere)
        )
        .push(' DO ')
        .push(this.updateBuilder?.toString() ?? 'NOTHING')
        .toString()
    }

    if (isUndefined(conflictingColumnName)) {
      return super.toString()
    }

    const updateBuilder = new UpdateBuilder(this.tableName)

    for (const { name, value } of this.pairs) {
      if (name !== conflictingColumnName) {
        updateBuilder.columnValue(name, value)
      } else {
        updateBuilder.where(wb => wb.push(conflictingColumnName, '=', value))
      }
    }

    return updateBuilder.toString()
  }

  where(
    whereBuilderCallback: TWhereBuilderCallback<WhereBuilder>,
    shouldAdd = true
  ): this {
    this.onConflictWhere = new BuilderWithWhere(WhereBuilder)

    this.onConflictWhere.where(whereBuilderCallback, shouldAdd)

    return this
  }
}
