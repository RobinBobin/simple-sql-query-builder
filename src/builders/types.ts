import type { SelectBuilderBase } from './BuildersWithWhere/SelectBuilderBase'
import type { FromBuilder } from './BuildersWithWhere/SelectBuilderBase/FromBuilder'
import type { UpdateBuilderBase } from './BuildersWithWhere/UpdateBuilderBase'
import type { InsertBuilderBase } from './InsertBuilderBase'
import type { TableBuilderBase } from './TableBuilderBase'
import type { WhereBuilderBase } from './WhereBuilderBase'
import type { TExtraClauseBase } from './WhereBuilderBase/types'

type TCallback<TBuilder> = (builder: TBuilder) => unknown

type TFromBuilderCallback = TCallback<FromBuilder>

type TInsertBuilderCallback<TInsertBuilder extends InsertBuilderBase> =
  TCallback<TInsertBuilder>

type TSelectBuilderCallback<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>,
  TSelectBuilder extends SelectBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >
> = TCallback<TSelectBuilder>

type TTableBuilderCallback<TTableBuilder extends TableBuilderBase> =
  TCallback<TTableBuilder>

type TUpdateBuilderCallback<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>,
  TUpdateBuilder extends UpdateBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >
> = TCallback<TUpdateBuilder>

type TWhereBuilderCallback<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
> = TCallback<TWhereBuilder>

interface ISqlBuilder<
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
  commit: () => unknown

  createTable: (
    name: string,
    callback: TTableBuilderCallback<TTableBuilder>,
    ifNotExists?: boolean
  ) => unknown

  delete: (
    table: string,
    callbackOrWhere?:
      | TWhereBuilderCallback<TOperator, TExtraClause, TWhereBuilder>
      | string
  ) => unknown

  insert: (
    tableName: string,
    insertBuilderCallback: TInsertBuilderCallback<TInsertBuilder>
  ) => unknown

  rollback: () => unknown

  select: (
    selectBuilderCallback: TSelectBuilderCallback<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TSelectBuilder
    >,
    isSubquery?: boolean
  ) => unknown

  update: (
    tableName: string,
    updateCallback: TUpdateBuilderCallback<
      TOperator,
      TExtraClause,
      TWhereBuilder,
      TUpdateBuilder
    >
  ) => unknown
}

type TInsertBuilderConstructor<TInsertBuilder extends InsertBuilderBase> = new (
  tableName: string
) => TInsertBuilder

type TSelectBuilderConstructor<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>,
  TSelectBuilder extends SelectBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >
> = new () => TSelectBuilder

type TTableBuilderConstructor<TTableBuilder extends TableBuilderBase> = new (
  ifNotExists: boolean,
  name: string
) => TTableBuilder

type TUpdateBuilderConstructor<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>,
  TUpdateBuilder extends UpdateBuilderBase<
    TOperator,
    TExtraClause,
    TWhereBuilder
  >
> = new (tableName: string) => TUpdateBuilder

type TWhereBuilderConstructor<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>,
  TWhereBuilder extends WhereBuilderBase<TOperator, TExtraClause>
> = new () => TWhereBuilder

export type {
  ISqlBuilder,
  TCallback,
  TFromBuilderCallback,
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
}
