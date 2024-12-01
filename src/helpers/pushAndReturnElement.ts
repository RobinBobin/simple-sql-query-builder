export const pushAndReturnElement = <TArray, TElement extends TArray>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  array: TArray[],
  element: TElement
): TElement => {
  array.push(element)

  return element
}
