import type {
  TClauseEntries,
  TStandardOperator
} from '../../builders/WhereBuilderBase/types'

import { WhereBuilderStringifierBase } from '../../builders/WhereBuilderBase/WhereBuilderStringifierBase'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class WhereBuilderStringifier extends WhereBuilderStringifierBase {
  constructor(clauses: TClauseEntries<TStandardOperator>) {
    super(clauses, FLAVOR_OPTIONS)
  }
}
