export const arrayLength = (
  arrayRepresentation: string,
  dimension: number
): string => {
  return `array_length(${arrayRepresentation}, ${dimension})`
}
