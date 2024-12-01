import type {
  TCellValue,
  TCellValues
} from '../../../../builders/WhereBuilderBase/types'

type TArray = TCellValues | string
type TManipulateArray = (array: TArray, value: TCellValue) => string

export type { TArray, TManipulateArray }
