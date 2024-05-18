

export function removeItem<T>(arr: Array<T>, item: T) {
  const index = arr.indexOf(item);
  if (index >= 0) {
    arr.splice(index, 1);
  }
  return arr;
}