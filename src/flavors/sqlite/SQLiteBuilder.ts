import type { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'
import type {
  ISqlBuilder,
  TInsertBuilderCallback,
  TSelectBuilderCallback,
  TTableBuilderCallback,
  TUpdateBuilderCallback,
  TWhereBuilderCallback
} from '../../builders/types'
import type { TStandardOperator } from '../../builders/WhereBuilderBase/types'
import type { TUpsertBuilderCallback } from './types'

import { SqlBuilderBase } from '../../builders/SqlBuilderBase'
import { InsertBuilder } from './InsertBuilder'
import { SelectBuilder } from './SelectBuilder'
import { TableBuilder } from './TableBuilder'
import { UpdateBuilder } from './UpdateBuilder'
import { UpsertBuilder } from './UpsertBuilder'
import { WhereBuilder } from './WhereBuilder'

class SQLiteBuilder
  extends SqlBuilderBase<
    TStandardOperator,
    InsertBuilder,
    TableBuilder,
    never,
    WhereBuilder,
    SelectBuilder,
    UpdateBuilder
  >
  implements
    ISqlBuilder<
      TStandardOperator,
      InsertBuilder,
      TableBuilder,
      never,
      WhereBuilder,
      SelectBuilder,
      UpdateBuilder
    >
{
  private static readonly emptyResultSet: ResultSet = {
    insertId: 0,
    rows: {
      item: () => '',
      length: 0,
      raw: () => []
    },
    rowsAffected: 0
  }

  private executeSql?: SQLiteDatabase['executeSql']

  constructor() {
    super(
      InsertBuilder,
      SelectBuilder,
      TableBuilder,
      UpdateBuilder,
      WhereBuilder
    )
  }

  commit(): Promise<[ResultSet]> {
    return this.execute(this.formatCommit())
  }

  createTable(
    name: string,
    callback: TTableBuilderCallback<TableBuilder>,
    ifNotExists = true
  ): Promise<[ResultSet]> {
    return this.execute(this.formatCreateTable(name, callback, ifNotExists))
  }

  delete(
    table: string,
    callbackOrWhere:
      | TWhereBuilderCallback<TStandardOperator, never, WhereBuilder>
      | string = ''
  ): Promise<[ResultSet]> {
    return this.execute(this.formatDelete(table, callbackOrWhere))
  }

  execute(sql: string): Promise<[ResultSet]> {
    if (this.executeSql && !this.shouldFormatOnly) {
      return this.executeSql(sql)
    }

    return Promise.resolve([SQLiteBuilder.emptyResultSet])
  }

  insert(
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<InsertBuilder>
  ): Promise<[ResultSet]> {
    return this.execute(this.formatInsert(tableName, insertBuilderCallback))
  }

  rollback(): Promise<[ResultSet]> {
    return this.execute(this.formatRollback())
  }

  select(
    selectBuilderCallback: TSelectBuilderCallback<
      TStandardOperator,
      never,
      WhereBuilder,
      SelectBuilder
    >,
    isSubquery = false
  ): Promise<[ResultSet]> {
    return this.execute(this.formatSelect(selectBuilderCallback, isSubquery))
  }

  setExecutor(executeSql: SQLiteDatabase['executeSql']): void {
    this.executeSql = executeSql
  }

  update(
    tableName: string,
    updateCallback: TUpdateBuilderCallback<
      TStandardOperator,
      never,
      WhereBuilder,
      UpdateBuilder
    >
  ): Promise<[ResultSet]> {
    return this.execute(this.formatUpdate(tableName, updateCallback))
  }

  async upsert(
    tableName: string,
    upsertBuilderCallback: TUpsertBuilderCallback
  ): Promise<[ResultSet]> {
    const upsertBuilder = new UpsertBuilder(tableName)

    try {
      return await this.execute(
        this.format(upsertBuilderCallback, upsertBuilder)
      )
    } catch (errorUpsert) {
      {
        const typedError = errorUpsert as Error

        if (!typedError.message.includes('SQLITE_ERROR')) {
          throw errorUpsert
        }
      }

      try {
        return await this.execute(upsertBuilder.toString(false))
      } catch (errorInsert) {
        const typedError = errorInsert as Error

        if (
          !typedError.message.includes('SQLITE_CONSTRAINT_PRIMARYKEY') &&
          !typedError.message.includes('SQLITE_CONSTRAINT_UNIQUE')
        ) {
          throw errorInsert
        }

        const columnName = typedError.message.substring(
          `UNIQUE constraint failed: ${tableName}.`.length,
          typedError.message.indexOf(' (code ')
        )

        return await this.execute(upsertBuilder.toString(false, columnName))
      }
    }
  }
}

const sqlite = new SQLiteBuilder()

export { sqlite, SQLiteBuilder }
