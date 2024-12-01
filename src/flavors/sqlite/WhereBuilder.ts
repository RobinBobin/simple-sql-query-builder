import type { TStandardOperator } from '../../builders/WhereBuilderBase/types'

import { WhereBuilderBase } from '../../builders/WhereBuilderBase'
import { WhereBuilderStringifier } from './WhereBuilderStringifier'

export class WhereBuilder extends WhereBuilderBase<TStandardOperator> {
  constructor() {
    super(WhereBuilderStringifier)
  }
}
