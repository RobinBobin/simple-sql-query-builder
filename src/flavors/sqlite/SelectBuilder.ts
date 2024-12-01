import { SelectBuilderBase } from '../../builders/BuildersWithWhere/SelectBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { WhereBuilder } from './WhereBuilder'

export class SelectBuilder extends SelectBuilderBase<WhereBuilder> {
  constructor() {
    super(WhereBuilder, FLAVOR_OPTIONS)
  }
}
