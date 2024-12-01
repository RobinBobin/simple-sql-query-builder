import { UpdateBuilderBase } from '../../builders/BuildersWithWhere/UpdateBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'
import { WhereBuilder } from './WhereBuilder'

export class UpdateBuilder extends UpdateBuilderBase<WhereBuilder> {
  constructor(tableName: string) {
    super(WhereBuilder, FLAVOR_OPTIONS, tableName)
  }
}
