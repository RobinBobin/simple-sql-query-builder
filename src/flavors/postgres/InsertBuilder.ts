import { isString } from 'radashi'

import { InsertBuilderBase } from '../../builders/InsertBuilderBase'
import { ConditionalArray } from '../../helpers/ConditionalArray'
import { FLAVOR_OPTIONS } from './flavorOptions'

export class InsertBuilder extends InsertBuilderBase {
  private returningFieldName?: string

  constructor(tableName: string) {
    super(FLAVOR_OPTIONS, tableName)
  }

  returning(fieldName: string, shouldAdd = true): this {
    if (shouldAdd) {
      this.returningFieldName = fieldName
    }

    return this
  }

  override toString(): string {
    return new ConditionalArray(super.toString())
      .push(
        ` RETURNING ${this.returningFieldName}`,
        isString(this.returningFieldName)
      )
      .toString()
  }
}
