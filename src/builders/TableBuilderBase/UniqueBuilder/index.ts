import { ArrayStringifier } from 'simple-common-utils'

import { pushAndReturnElement } from '../../../helpers/pushAndReturnElement'
import { UniqueEntry } from './UniqueEntry'

export class UniqueBuilder {
  private readonly entries: UniqueEntry[] = []

  column(name: string): UniqueEntry {
    return pushAndReturnElement(this.entries, new UniqueEntry(name))
  }

  toString(): string {
    return new ArrayStringifier(this.entries)
      .setPrefix('UNIQUE (')
      .setPostfix(')')
      .toString()
  }
}
