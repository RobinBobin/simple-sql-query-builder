import type { TClause, TOperator } from './extraOperators'

import { WhereBuilderBase } from '../../builders/WhereBuilderBase'
import { WhereBuilderStringifier } from './WhereBuilderStringifier'

export class WhereBuilder extends WhereBuilderBase<TOperator, TClause> {
  constructor() {
    super(WhereBuilderStringifier)
  }
}
