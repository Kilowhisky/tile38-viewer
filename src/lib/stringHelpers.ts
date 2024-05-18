


// From here: https://stackoverflow.com/a/9436948/1148118
export function isString(value: string | unknown): boolean {
  return typeof value === 'string' || value instanceof String;
}