import type { IsNever } from 'type-fest'
import type { WhereBuilderStringifierBase } from './WhereBuilderStringifierBase'

type TColumnName = string
type TGrouping = 'AND' | 'AND NOT' | 'OR' | '(' | ')'
type TCellValue = number | string
type TCellValues = readonly TCellValue[]

type TOperatorIn = 'IN'
type TOperatorIsNotNull = 'IS NOT NULL'
type TOperatorIsNull = 'IS NULL'
type TOperatorLike = 'LIKE'
type TOperatorWithCellValue = '=' | '>' | '>=' | '<' | '<=' | '!='

type TStandardOperator =
  | TOperatorIn
  | TOperatorIsNotNull
  | TOperatorIsNull
  | TOperatorLike
  | TOperatorWithCellValue

type TOperatorFactory<TExtraOperator extends string> =
  | TStandardOperator
  | TExtraOperator

type TClauseWithoutArguments<TOperator extends string> = readonly [
  TColumnName,
  TOperator
]

type TClauseDefinition<
  TOperator extends string,
  TArguments extends readonly unknown[] = never,
  TRest extends boolean = false
> = readonly [
  ...TClauseWithoutArguments<TOperator>,
  ...(IsNever<TArguments> extends true ? []
  : TRest extends true ? TArguments
  : [TArguments])
]

type TClauseIn = TClauseDefinition<TOperatorIn, TCellValues>
type TClauseIsNotNull = TClauseDefinition<TOperatorIsNotNull>
type TClauseIsNull = TClauseDefinition<TOperatorIsNull>

type TPattern = string
type TStartsWith = boolean
type TEndsWith = boolean

type TClauseLike = TClauseDefinition<
  TOperatorLike,
  [TPattern, TStartsWith?, TEndsWith?],
  true
>

type TClauseWithCellValue = TClauseDefinition<
  TOperatorWithCellValue,
  [TCellValue],
  true
>

type TStandardClause =
  | TClauseIn
  | TClauseIsNotNull
  | TClauseIsNull
  | TClauseLike
  | TClauseWithCellValue

type TExtraClauseBase<TOperator extends string> = readonly [
  ...TClauseWithoutArguments<TOperator>,
  ...(readonly unknown[])
]

type TClauseFactory<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>
> =
  IsNever<TExtraClause> extends true ? TStandardClause
  : TStandardClause | TExtraClause

type TClauseEntry<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator> = never
> = TClauseFactory<TOperator, TExtraClause> | TGrouping

type TClauseEntries<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator> = never
> = readonly TClauseEntry<TOperator, TExtraClause>[]

type TAddClauseParameterType<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>
> = TClauseFactory<TOperator, TExtraClause> | readonly never[]

type TWhereBuilderStringifierConstructor<
  TOperator extends string,
  TExtraClause extends TExtraClauseBase<TOperator>
> = new (
  clauses: TClauseEntry<TOperator, TExtraClause>[]
) => WhereBuilderStringifierBase

export type {
  TAddClauseParameterType,
  TCellValue,
  TCellValues,
  TClauseDefinition,
  TClauseEntries,
  TClauseEntry,
  TClauseFactory,
  TClauseIn,
  TClauseIsNotNull,
  TClauseIsNull,
  TClauseLike,
  TClauseWithCellValue,
  TClauseWithoutArguments,
  TColumnName,
  TExtraClauseBase,
  TGrouping,
  TOperatorFactory,
  TOperatorIn,
  TOperatorIsNotNull,
  TOperatorIsNull,
  TOperatorLike,
  TOperatorWithCellValue,
  TStandardClause,
  TStandardOperator,
  TWhereBuilderStringifierConstructor
}
