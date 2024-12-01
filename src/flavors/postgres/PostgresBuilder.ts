import type {
  ISqlBuilder,
  TInsertBuilderCallback,
  TSelectBuilderCallback,
  TTableBuilderCallback,
  TUpdateBuilderCallback,
  TWhereBuilderCallback
} from '../../builders/types'
import type { TClause, TOperator } from './extraOperators'

import { SqlBuilderBase } from '../../builders/SqlBuilderBase'
import { InsertBuilder } from './InsertBuilder'
import { SelectBuilder } from './SelectBuilder'
import { TableBuilder } from './TableBuilder'
import { UpdateBuilder } from './UpdateBuilder'
import { WhereBuilder } from './WhereBuilder'

class PostgresBuilder
  extends SqlBuilderBase<
    TOperator,
    InsertBuilder,
    TableBuilder,
    TClause,
    WhereBuilder,
    SelectBuilder,
    UpdateBuilder
  >
  implements
    ISqlBuilder<
      TOperator,
      InsertBuilder,
      TableBuilder,
      TClause,
      WhereBuilder,
      SelectBuilder,
      UpdateBuilder
    >
{
  private executeSql?: (sql: string) => Promise<unknown>

  constructor() {
    super(
      InsertBuilder,
      SelectBuilder,
      TableBuilder,
      UpdateBuilder,
      WhereBuilder
    )
  }

  commit(): Promise<unknown> {
    return this.execute(this.formatCommit())
  }

  createTable(
    name: string,
    callback: TTableBuilderCallback<TableBuilder>,
    ifNotExists = true
  ): Promise<unknown> {
    return this.execute(this.formatCreateTable(name, callback, ifNotExists))
  }

  delete(
    table: string,
    callbackOrWhere:
      | TWhereBuilderCallback<TOperator, TClause, WhereBuilder>
      | string = ''
  ): Promise<unknown> {
    return this.execute(this.formatDelete(table, callbackOrWhere))
  }

  execute(sql: string): Promise<unknown> {
    if (this.executeSql && !this.shouldFormatOnly) {
      return this.executeSql(sql)
    }

    return Promise.resolve()
  }

  insert(
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<InsertBuilder>
  ): Promise<unknown> {
    return this.execute(this.formatInsert(tableName, insertBuilderCallback))
  }

  rollback(): Promise<unknown> {
    return this.execute(this.formatRollback())
  }

  select(
    selectBuilderCallback: TSelectBuilderCallback<
      TOperator,
      TClause,
      WhereBuilder,
      SelectBuilder
    >,
    isSubquery = false
  ): Promise<unknown> {
    return this.execute(this.formatSelect(selectBuilderCallback, isSubquery))
  }

  setExecutor(executeSql: (sql: string) => Promise<unknown>): void {
    this.executeSql = executeSql
  }

  update(
    tableName: string,
    updateCallback: TUpdateBuilderCallback<
      TOperator,
      TClause,
      WhereBuilder,
      UpdateBuilder
    >
  ): Promise<unknown> {
    return this.execute(this.formatUpdate(tableName, updateCallback))
  }
}

const postgres = new PostgresBuilder()

export { postgres, PostgresBuilder }
