
interface StringsInObject {
  [key: string]: string
}

interface NumbersInObject {
  [key: string]: number
}

export const byStringKeyObjectSorter = ({ isAscending: isAscending = true, keyName = '', } = {}) =>
  (left: object, right: object) => {
  const leftValue = (left as StringsInObject)[keyName];
  const rightValue = (right as StringsInObject)[keyName];
  return isAscending
    ? leftValue.localeCompare(rightValue)
    : rightValue.localeCompare(leftValue)
}

export const byIntegerKeyObjectSorter = ({ isAscending: isAscending = true, keyName = '', } = {}) =>
  (left: object, right: object) => {
  const leftValue = (left as NumbersInObject)[keyName];
  const rightValue = (right as NumbersInObject)[keyName];
  return isAscending
    ? leftValue - rightValue
    : rightValue - leftValue
}
