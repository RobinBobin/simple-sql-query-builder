import type {
  TCellValues,
  TClauseDefinition,
  TClauseFactory,
  TOperatorFactory
} from '../../../builders/WhereBuilderBase/types'
import type { ExtraOperator } from './ExtraOperator'

type TOperator = TOperatorFactory<keyof typeof ExtraOperator>

type TClause = TClauseFactory<TOperator, TClauseDefinition<'@>', TCellValues>>

export type { TClause, TOperator }
