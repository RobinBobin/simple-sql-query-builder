import type { SelectBuilderBase } from './BuildersWithWhere/SelectBuilderBase'
import type UpdateBuilderBase from './BuildersWithWhere/UpdateBuilderBase'
import type InsertBuilderBase from './InsertBuilderBase'
import type { TableBuilderBase } from './TableBuilderBase'
import type {
  TCallback,
  TInsertBuilderCallback,
  TInsertBuilderConstructor,
  TSelectBuilderCallback,
  TSelectBuilderConstructor,
  TTableBuilderCallback,
  TTableBuilderConstructor,
  TUpdateBuilderCallback,
  TUpdateBuilderConstructor,
  TWhereBuilderCallback,
  TWhereBuilderConstructor
} from './types'
import type { WhereBuilderBase } from './WhereBuilderBase'

import { isObject, isString } from 'radashi'

export class SqlBuilderBase<
  TInsertBuilder extends InsertBuilderBase,
  TTableBuilder extends TableBuilderBase,
  TWhereBuilder extends WhereBuilderBase,
  TSelectBuilder extends SelectBuilderBase<TWhereBuilder>,
  TUpdateBuilder extends UpdateBuilderBase<TWhereBuilder>
> {
  private __isDebugMode = false

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly InsertBuilderConstructor: TInsertBuilderConstructor<TInsertBuilder>,
    private readonly SelectBuilderConstructor: TSelectBuilderConstructor<
      TWhereBuilder,
      TSelectBuilder
    >,
    private readonly TableBuilderConstructor: TTableBuilderConstructor<TTableBuilder>,
    private readonly UpdateBuilderConstructor: TUpdateBuilderConstructor<
      TWhereBuilder,
      TUpdateBuilder
    >,
    private readonly WhereBuilderConstructor: TWhereBuilderConstructor<TWhereBuilder>
  ) {
    // Nothing to do
  }

  commit(): string {
    return this.format('COMMIT')
  }

  createTable(
    name: string,
    callback: TTableBuilderCallback<TTableBuilder>,
    ifNotExists = true
  ): string {
    return this.format(
      callback,
      new this.TableBuilderConstructor(ifNotExists, name)
    )
  }

  delete(
    table: string,
    callbackOrWhere: TWhereBuilderCallback<TWhereBuilder> | string = ''
  ): string {
    let where: TWhereBuilder | string

    if (isString(callbackOrWhere)) {
      where = callbackOrWhere
    } else {
      where = new this.WhereBuilderConstructor()

      callbackOrWhere(where)
    }

    return this.format(`DELETE FROM ${table}${where.toString()}`)
  }

  format(rawSql: string): string
  format<TBuilder>(callback: TCallback<TBuilder>, builder: TBuilder): string

  format<TBuilder>(
    rawSqlOrCallback: TCallback<TBuilder> | string,
    builder?: TBuilder
  ): string {
    const hasBuilder = isObject(builder)

    if (isString(rawSqlOrCallback)) {
      if (hasBuilder) {
        throw new TypeError('`builder` must not be supplied')
      }

      const sql = `${rawSqlOrCallback};`

      if (this.isDebugMode) {
        console.log(sql)
      }

      return sql
    }

    if (!hasBuilder) {
      throw new TypeError('`builder` must be supplied')
    }

    rawSqlOrCallback(builder)

    return this.format(builder.toString())
  }

  insert(
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<TInsertBuilder>
  ): string {
    return this.format(
      insertBuilderCallback,
      new this.InsertBuilderConstructor(tableName)
    )
  }

  get isDebugMode(): boolean {
    return this.__isDebugMode
  }

  set isDebugMode(isDebugMode) {
    this.__isDebugMode = isDebugMode
  }

  rollback(): string {
    return this.format('ROLLBACK')
  }

  select(
    selectBuilderCallback: TSelectBuilderCallback<
      TWhereBuilder,
      TSelectBuilder
    >,
    isSubquery = false
  ): string {
    const builder = new this.SelectBuilderConstructor()

    if (!isSubquery) {
      return this.format(selectBuilderCallback, builder)
    }

    selectBuilderCallback(builder)

    return `(${builder.toString()})`
  }

  startTransaction(): string {
    return this.format('START TRANSACTION')
  }

  update(
    tableName: string,
    updateCallback: TUpdateBuilderCallback<TWhereBuilder, TUpdateBuilder>
  ): string {
    return this.format(
      updateCallback,
      new this.UpdateBuilderConstructor(tableName)
    )
  }
}
