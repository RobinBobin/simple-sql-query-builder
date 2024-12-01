export class Entry {
  protected readonly attrs: string[] = []

  constructor(protected readonly name: string) {
    // Nothing to do
  }

  attr(attr: string): this {
    this.attrs.push(attr)

    return this
  }
}
