import type { TStandardOperator } from '../../builders/WhereBuilderBase/types'

import { UpdateBuilderBase } from '../../builders/BuildersWithWhere/UpdateBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { WhereBuilder } from './WhereBuilder'

export class UpdateBuilder extends UpdateBuilderBase<
  TStandardOperator,
  never,
  WhereBuilder
> {
  constructor(tableName: string) {
    super(WhereBuilder, FLAVOR_OPTIONS, tableName)
  }
}
