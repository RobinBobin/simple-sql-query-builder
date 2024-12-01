import type { SelectBuilderBase } from './BuildersWithWhere/SelectBuilderBase'
import type { UpdateBuilderBase } from './BuildersWithWhere/UpdateBuilderBase'
import type { InsertBuilderBase } from './InsertBuilderBase'
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
  private __shouldFormatOnly = false

  // eslint-disable-next-line @typescript-eslint/max-params
  protected constructor(
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

  get isDebugMode(): boolean {
    return this.__isDebugMode
  }

  set isDebugMode(isDebugMode) {
    this.__isDebugMode = isDebugMode
  }

  get shouldFormatOnly(): boolean {
    return this.__shouldFormatOnly
  }

  set shouldFormatOnly(shouldFormatOnly) {
    this.__shouldFormatOnly = shouldFormatOnly
  }

  protected formatCommit(): string {
    return this.format('COMMIT')
  }

  protected formatCreateTable(
    name: string,
    callback: TTableBuilderCallback<TTableBuilder>,
    ifNotExists = true
  ): string {
    return this.format(
      callback,
      new this.TableBuilderConstructor(ifNotExists, name)
    )
  }

  protected formatDelete(
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

    return this.format(['DELETE FROM ', table, where].join(''))
  }

  protected formatInsert(
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<TInsertBuilder>
  ): string {
    return this.format(
      insertBuilderCallback,
      new this.InsertBuilderConstructor(tableName)
    )
  }

  protected formatRollback(): string {
    return this.format('ROLLBACK')
  }

  protected formatSelect(
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

    return ['(', builder, ')'].join('')
  }

  protected formatStartTransaction(): string {
    return this.format('START TRANSACTION')
  }

  protected formatUpdate(
    tableName: string,
    updateCallback: TUpdateBuilderCallback<TWhereBuilder, TUpdateBuilder>
  ): string {
    return this.format(
      updateCallback,
      new this.UpdateBuilderConstructor(tableName)
    )
  }

  protected format(rawSql: string): string
  protected format<TBuilder>(
    callback: TCallback<TBuilder>,
    builder: TBuilder
  ): string

  protected format<TBuilder>(
    rawSqlOrCallback: TCallback<TBuilder> | string,
    builder?: TBuilder
  ): string {
    const hasBuilder = isObject(builder)

    if (isString(rawSqlOrCallback)) {
      if (hasBuilder) {
        throw new TypeError('`builder` must not be supplied')
      }

      const sql = [rawSqlOrCallback, ';'].join('')

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
}
