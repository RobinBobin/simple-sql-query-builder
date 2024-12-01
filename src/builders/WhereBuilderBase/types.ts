import type { ReadonlyDeep } from 'type-fest'

type TColumnName = string
type TGrouping = 'AND' | 'AND NOT' | 'OR' | '(' | ')'
type TColumnValue = number | string

type TOperatorIn = 'IN'
type TOperatorIsNotNull = 'IS NOT NULL'
type TOperatorIsNull = 'IS NULL'
type TOperatorLike = 'LIKE'
type TOperatorWithValueValue = '=' | '>' | '>=' | '<' | '<=' | '!='

type TClauseIn = [TColumnName, TOperatorIn, TColumnValue[]]
type TClauseIsNotNull = [TColumnName, TOperatorIsNotNull]
type TClauseIsNull = [TColumnName, TOperatorIsNull]

type TPattern = string
type TStartsWith = boolean
type TEndsWith = boolean

type TClauseLike = [
  TColumnName,
  TOperatorLike,
  TPattern,
  TStartsWith?,
  TEndsWith?
]

type TClauseWithValueValue = [
  TColumnName,
  TOperatorWithValueValue,
  TColumnValue
]

type TClause =
  | TClauseIn
  | TClauseIsNotNull
  | TClauseIsNull
  | TClauseLike
  | TClauseWithValueValue

type TClauseEntry = ReadonlyDeep<TClause> | TGrouping
type TAddClauseParameterType = ReadonlyDeep<TClause | never[]>

export type {
  TAddClauseParameterType,
  TClause,
  TClauseEntry,
  TClauseIn,
  TClauseIsNotNull,
  TClauseIsNull,
  TClauseLike,
  TClauseWithValueValue,
  TColumnName,
  TColumnValue,
  TGrouping,
  TOperatorIn,
  TOperatorIsNotNull,
  TOperatorIsNull,
  TOperatorLike,
  TOperatorWithValueValue
}
