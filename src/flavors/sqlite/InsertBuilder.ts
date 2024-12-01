import { InsertBuilderBase } from '../../builders/InsertBuilderBase'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class InsertBuilder extends InsertBuilderBase {
  constructor(tableName: string) {
    super(FLAVOR_OPTIONS, tableName)
  }
}
