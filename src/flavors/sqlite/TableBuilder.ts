import { TableBuilderBase } from '../../builders/TableBuilderBase'
import { ConditionalArray } from '../../helpers/ConditionalArray'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class TableBuilder extends TableBuilderBase {
  private __withoutRowid = false

  constructor(ifNotExists: boolean, name: string) {
    super(FLAVOR_OPTIONS, ifNotExists, name)
  }

  override toString(): string {
    return new ConditionalArray()
      .push(super.toString())
      .push(' WITHOUT ROWID', this.__withoutRowid)
      .toString()
  }

  withoutRowid(withoutRowid = true): void {
    this.__withoutRowid = withoutRowid
  }
}
