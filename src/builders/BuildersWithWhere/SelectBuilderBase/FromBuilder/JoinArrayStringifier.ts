import type { ReadonlyDeep } from 'type-fest'
import type { IJoin } from '../types'

import { ArrayStringifier } from 'simple-common-utils'

export class JoinArrayStringifier extends ArrayStringifier<IJoin> {
  constructor(joins: ReadonlyDeep<IJoin[]>) {
    super(joins)

    this.setPrefix(' ').setSeparator(' ')
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected override getStringifiedElement(
    __: number,
    { field1, field2, table, type }: Readonly<IJoin>
  ): string {
    return [type, table, 'ON', field1, '=', field2].join(' ')
  }
}
