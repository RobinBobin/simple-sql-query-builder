import type { SelectBuilderBase } from './BuildersWithWhere/SelectBuilderBase'
import type FromBuilder from './BuildersWithWhere/SelectBuilderBase/FromBuilder'
import type UpdateBuilderBase from './BuildersWithWhere/UpdateBuilderBase'
import type InsertBuilderBase from './InsertBuilderBase'
import type { TableBuilderBase } from './TableBuilderBase'
import type { WhereBuilderBase } from './WhereBuilderBase'

type TCallback<TBuilder> = (builder: TBuilder) => void

type TInsertBuilderConstructor<TInsertBuilder extends InsertBuilderBase> = new (
  tableName: string
) => TInsertBuilder

type TSelectBuilderConstructor<
  TWhereBuilder extends WhereBuilderBase,
  TSelectBuilder extends SelectBuilderBase<TWhereBuilder>
> = new () => TSelectBuilder

type TTableBuilderConstructor<TTableBuilder extends TableBuilderBase> = new (
  ifNotExists: boolean,
  name: string
) => TTableBuilder

type TUpdateBuilderConstructor<
  TWhereBuilder extends WhereBuilderBase,
  TUpdateBuilder extends UpdateBuilderBase<TWhereBuilder>
> = new (tableName: string) => TUpdateBuilder

type TWhereBuilderConstructor<TWhereBuilder extends WhereBuilderBase> =
  new () => TWhereBuilder

type TFromBuilderCallback = TCallback<FromBuilder>

type TInsertBuilderCallback<TInsertBuilder extends InsertBuilderBase> =
  TCallback<TInsertBuilder>

type TSelectBuilderCallback<
  TWhereBuilder extends WhereBuilderBase,
  TSelectBuilder extends SelectBuilderBase<TWhereBuilder>
> = TCallback<TSelectBuilder>

type TTableBuilderCallback<TTableBuilder extends TableBuilderBase> =
  TCallback<TTableBuilder>

type TUpdateBuilderCallback<
  TWhereBuilder extends WhereBuilderBase,
  TUpdateBuilder extends UpdateBuilderBase<TWhereBuilder>
> = TCallback<TUpdateBuilder>

type TWhereBuilderCallback<TWhereBuilder extends WhereBuilderBase> =
  TCallback<TWhereBuilder>

export type {
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
