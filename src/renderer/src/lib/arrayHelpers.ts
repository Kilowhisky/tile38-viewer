

export function removeItem<T>(arr: Array<T>, item: T) {
  const index = arr.indexOf(item);
  if (index >= 0) {
    arr.splice(index, 1);
  }
  return arr;
}

export function unique<T>(arr: Array<T>) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) == index;
  })
}

export function uniqueBy<T>(arr: Array<T>, key: keyof T) {
  return arr.filter((item, index) => {
    return arr.findIndex(a => a[key] == item[key]) == index;
  })
}
