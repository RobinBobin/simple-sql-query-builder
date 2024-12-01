import type { TColumnOrder } from './types'

import { ArrayStringifier } from 'simple-common-utils'

import { Entry } from '../../Entry'

export class UniqueEntry extends Entry {
  collate(collation: string): this {
    return this.attr(`COLLATE ${collation}`)
  }

  order(order: TColumnOrder): this {
    return this.attr(order)
  }

  override toString(): string {
    return new ArrayStringifier(this.attrs)
      .setPrefix(`${this.name} `)
      .setSeparator(' ')
      .toString()
  }
}
