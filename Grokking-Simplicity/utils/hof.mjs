export function filter(array, f) {
  const result = [];
  for (const element of array) {
    if (f(element)) {
      result.push(element);
    }
  }
  return result;
}

export function reduce(array, init, f) {
  let result = init;
  for (const element of array) {
    result = f(result, element);
  }
  return result;
}

export function map(array, f) {
  const result = [];
  for (const element of array) {
    result.push(f(element));
  }
  return result;
}
