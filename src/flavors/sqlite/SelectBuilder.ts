import type { TStandardOperator } from '../../builders/WhereBuilderBase/types'

import { SelectBuilderBase } from '../../builders/BuildersWithWhere/SelectBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { WhereBuilder } from './WhereBuilder'

export class SelectBuilder extends SelectBuilderBase<
  TStandardOperator,
  never,
  WhereBuilder
> {
  constructor() {
    super(WhereBuilder, FLAVOR_OPTIONS)
  }
}
