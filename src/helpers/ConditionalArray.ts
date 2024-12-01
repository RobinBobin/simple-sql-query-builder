import { isString } from 'radashi'

export class ConditionalArray {
  private readonly elements: string[] = []

  constructor(element?: string) {
    if (isString(element)) {
      this.push(element)
    }
  }

  push(element: string, condition = true): this {
    if (condition) {
      this.elements.push(element)
    }

    return this
  }

  toString(): string {
    return this.elements.join('')
  }
}
