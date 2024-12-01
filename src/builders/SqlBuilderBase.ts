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
import type { TExtraClauseBase } from './WhereBuilderBase/types'

import { isObject, isString } from 'radashi'

export class SqlBuilderBase<
  TOperator extends string,
  TInsertBuilder extends InsertBuilderBase,
  TTableBuilder extends TableBuilderBase,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>,
  TSelectBuilder extends SelectBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >,
  TUpdateBuilder extends UpdateBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >
> {
  private __isDebugMode = false
  private __shouldFormatOnly = false

  // eslint-disable-next-line @typescript-eslint/max-params
  protected constructor(
    private readonly InsertBuilder: TInsertBuilderConstructor<TInsertBuilder>,
    private readonly SelectBuilder: TSelectBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TSelectBuilder
    >,
    private readonly TableBuilder: TTableBuilderConstructor<TTableBuilder>,
    private readonly UpdateBuilder: TUpdateBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TUpdateBuilder
    >,
    private readonly WhereBuilder: TWhereBuilderConstructor<
      TOperator,
      TExtraClause,
      TWhereBuilder
    >
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
    return this.format(callback, new this.TableBuilder(ifNotExists, name))
  }

  protected formatDelete(
    table: string,
    callbackOrWhere:
      | TWhereBuilderCallback<TOperator, TExtraClause, TWhereBuilder>
      | string = ''
  ): string {
    let where: TWhereBuilder | string

    if (isString(callbackOrWhere)) {
      where = callbackOrWhere
    } else {
      where = new this.WhereBuilder()

      callbackOrWhere(where)
    }

    return this.format(['DELETE FROM ', table, where].join(''))
  }

  protected formatInsert(
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<TInsertBuilder>
  ): string {
    return this.format(insertBuilderCallback, new this.InsertBuilder(tableName))
  }

  protected formatRollback(): string {
    return this.format('ROLLBACK')
  }

  protected formatSelect(
    selectBuilderCallback: TSelectBuilderCallback<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TSelectBuilder
    >,
    isSubquery = false
  ): string {
    const builder = new this.SelectBuilder()

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
    updateCallback: TUpdateBuilderCallback<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TUpdateBuilder
    >
  ): string {
    return this.format(updateCallback, new this.UpdateBuilder(tableName))
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
