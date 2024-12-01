import { TableBuilderBase } from '../../builders/TableBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class TableBuilder extends TableBuilderBase {
  constructor(ifNotExists: boolean, name: string) {
    super(FLAVOR_OPTIONS, ifNotExists, name)
  }
}
