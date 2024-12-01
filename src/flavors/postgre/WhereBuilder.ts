import { WhereBuilderBase } from '../../builders/WhereBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class WhereBuilder extends WhereBuilderBase {
  constructor() {
    super(FLAVOR_OPTIONS)
  }
}
